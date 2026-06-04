import { useTripStore } from '../src/store/tripStore';
import apiClient from '../src/services/apiClient';
import { connectSocket, getSocket } from '../src/services/socketClient';
import { TripStatus } from '../src/types';

jest.mock('../src/services/apiClient', () => ({
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
}));

jest.mock('../src/services/socketClient', () => {
    const mockSocket = {
        connected: false,
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
    };
    return {
        connectSocket: jest.fn(() => {
            mockSocket.connected = true;
            return mockSocket;
        }),
        disconnectSocket: jest.fn(() => {
            mockSocket.connected = false;
        }),
        getSocket: jest.fn(() => mockSocket),
    };
});

// Mock authStore to return a dummy token
jest.mock('../src/store/authStore', () => ({
    useAuthStore: {
        getState: () => ({
            token: 'mock-driver-token',
        }),
    },
}));

describe('tripStore Unit Tests', () => {
    let mockSocket: any;

    beforeEach(() => {
        jest.clearAllMocks();
        mockSocket = getSocket();
        mockSocket.connected = false;
        mockSocket.on.mockClear();
        mockSocket.off.mockClear();
        mockSocket.emit.mockClear();

        // Reset store state
        useTripStore.setState({
            tripStatus: TripStatus.OFFLINE,
            currentTrip: null,
            customerMood: null,
            customerRating: 0,
            ratingStep: null,
            chatMessages: [],
            hasUnreadChat: false,
        });
    });

    test('toggleOnline(true) should connect socket and listen to events', async () => {
        (apiClient.patch as jest.Mock).mockResolvedValueOnce({});
        
        await useTripStore.getState().toggleOnline(true);

        expect(apiClient.patch).toHaveBeenCalledWith('/drivers/availability', { is_active: true });
        expect(connectSocket).toHaveBeenCalledWith('mock-driver-token');
        expect(useTripStore.getState().tripStatus).toBe(TripStatus.ONLINE);
        expect(mockSocket.on).toHaveBeenCalledWith('server:ride_request', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('server:offer_expired', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('server:trip_cancelled', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('receive_message', expect.any(Function));
    });

    test('should handle server:ride_request socket payload and parse customer info correctly', async () => {
        (apiClient.patch as jest.Mock).mockResolvedValueOnce({});
        await useTripStore.getState().toggleOnline(true);

        // Find the event listener for 'server:ride_request'
        const rideRequestCall = mockSocket.on.mock.calls.find((call: any) => call[0] === 'server:ride_request');
        expect(rideRequestCall).toBeDefined();
        const rideRequestHandler = rideRequestCall[1];

        // Simulate receiving socket event with enriched player data
        const payload = {
            trip_id: 'trip-999',
            customer_id: 'cust-111',
            customer_phone: '0911222333',
            customer_name: 'Nguyễn Văn Khách',
            customer_avatar: 'https://avatar.io/cust111',
            customer_rating: 4.9,
            pickup_address: '123 Pickup St',
            pickup_latitude: 10.1,
            pickup_longitude: 106.1,
            dropoff_address: '456 Dropoff St',
            dropoff_latitude: 10.2,
            dropoff_longitude: 106.2,
            estimated_fare: 50000,
        };

        rideRequestHandler(payload);

        const currentTrip = useTripStore.getState().currentTrip;
        expect(useTripStore.getState().tripStatus).toBe(TripStatus.BOOKING_INCOMING);
        expect(currentTrip).toBeDefined();
        expect(currentTrip?.id).toBe('trip-999');
        expect(currentTrip?.customer).toEqual({
            id: 'cust-111',
            name: 'Nguyễn Văn Khách',
            phone: '0911222333',
            rating: 4.9,
            avatarUrl: 'https://avatar.io/cust111',
        });
        expect(currentTrip?.fare).toBe(50000);
    });

    test('acceptTrip should call accept API and join socket room', async () => {
        mockSocket.connected = true;
        useTripStore.setState({
            tripStatus: TripStatus.BOOKING_INCOMING,
            currentTrip: {
                id: 'trip-999',
                status: TripStatus.BOOKING_INCOMING,
                customer: {
                    id: 'cust-111',
                    name: 'Nguyễn Văn Khách',
                    phone: '0911222333',
                    rating: 4.9,
                    avatarUrl: '',
                },
                pickup: { address: '', latitude: 0, longitude: 0 },
                dropoff: { address: '', latitude: 0, longitude: 0 },
                createdAt: '',
            },
        });

        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { status: 'ACCEPTED' },
        });

        await useTripStore.getState().acceptTrip();

        expect(apiClient.post).toHaveBeenCalledWith('/rides/trip-999/accept');
        expect(mockSocket.emit).toHaveBeenCalledWith('join_trip_room', { trip_id: 'trip-999' });
        expect(useTripStore.getState().tripStatus).toBe(TripStatus.ARRIVING);
    });

    test('confirmArrived should call arrived patch API', async () => {
        useTripStore.setState({
            tripStatus: TripStatus.ARRIVING,
            currentTrip: {
                id: 'trip-999',
                status: TripStatus.ARRIVING,
                customer: { id: '', name: '', phone: '', rating: 5, avatarUrl: '' },
                pickup: { address: '', latitude: 0, longitude: 0 },
                dropoff: { address: '', latitude: 0, longitude: 0 },
                createdAt: '',
            },
        });

        (apiClient.patch as jest.Mock).mockResolvedValueOnce({});

        await useTripStore.getState().confirmArrived();

        expect(apiClient.patch).toHaveBeenCalledWith('/trips/trip-999/status', { status: 'ARRIVED' });
        expect(useTripStore.getState().tripStatus).toBe(TripStatus.ARRIVED);
    });
});

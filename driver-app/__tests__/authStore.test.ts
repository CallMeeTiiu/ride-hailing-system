import { useAuthStore } from '../src/store/authStore';
import apiClient from '../src/services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../src/services/apiClient', () => ({
    get: jest.fn(),
    put: jest.fn(),
    post: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

describe('authStore Unit Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset store state
        useAuthStore.setState({
            isLoggedIn: false,
            isProfileComplete: false,
            token: null,
            driver: null,
            isLoading: false,
            error: null,
        });
    });

    test('should identify profile as incomplete if driver has placeholder name', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: {
                userId: 'driver-123',
                profile: {
                    name: 'Tài xế mới',
                    license_number: '123456789',
                    rating: 5.0,
                    avatar_url: '',
                },
            },
        });

        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: [{
                id: 'vehicle-123',
                plate_number: '29A-123.45',
                brand: 'Honda',
                model: 'Wave',
                color: 'Đỏ',
            }],
        });

        const success = await useAuthStore.getState().fetchProfile();
        expect(success).toBe(true);
        expect(useAuthStore.getState().isProfileComplete).toBe(false);
    });

    test('should identify profile as complete if name, vehicle plate and license number are filled', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: {
                userId: 'driver-123',
                profile: {
                    name: 'Nguyễn Văn Tài Xế',
                    license_number: '123456789',
                    rating: 4.85,
                    avatar_url: 'https://avatar.url',
                },
            },
        });

        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: [{
                id: 'vehicle-123',
                plate_number: '29A-123.45',
                brand: 'Honda',
                model: 'Wave',
                color: 'Đỏ',
            }],
        });

        const success = await useAuthStore.getState().fetchProfile();
        expect(success).toBe(true);
        expect(useAuthStore.getState().isProfileComplete).toBe(true);
        expect(useAuthStore.getState().driver).toEqual({
            id: 'driver-123',
            name: 'Nguyễn Văn Tài Xế',
            phone: '',
            avatarUrl: 'https://avatar.url',
            rating: 4.85,
            vehiclePlate: '29A-123.45',
            licenseNumber: '123456789',
            vehicleId: 'vehicle-123',
            brand: 'Honda',
            model: 'Wave',
            color: 'Đỏ',
        });
    });

    test('should identify profile as incomplete if brand, model, or color is missing', async () => {
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: {
                userId: 'driver-123',
                profile: {
                    name: 'Nguyễn Văn Tài Xế',
                    license_number: '123456789',
                    rating: 4.85,
                    avatar_url: 'https://avatar.url',
                },
            },
        });

        // Mock vehicle missing brand/model/color
        (apiClient.get as jest.Mock).mockResolvedValueOnce({
            data: [{
                id: 'vehicle-123',
                plate_number: '29A-123.45',
                brand: '',
                model: '',
                color: '',
            }],
        });

        const success = await useAuthStore.getState().fetchProfile();
        expect(success).toBe(true);
        expect(useAuthStore.getState().isProfileComplete).toBe(false);
    });

    test('updateDriverProfile should update personal profile and vehicle info on backend and local state', async () => {
        // Set initial state
        useAuthStore.setState({
            driver: {
                id: 'driver-123',
                name: 'Tài xế mới',
                phone: '0987654321',
                avatarUrl: 'https://avatar.url',
                rating: 5.0,
                vehiclePlate: 'Chưa cập nhật',
                licenseNumber: '',
                vehicleId: '',
            },
        });

        (apiClient.put as jest.Mock).mockResolvedValueOnce({});
        (apiClient.post as jest.Mock).mockResolvedValueOnce({
            data: { id: 'new-vehicle-456' },
        });

        const success = await useAuthStore.getState().updateDriverProfile(
            'Nguyễn Văn A',
            '59-X1 999.99',
            'GPLX123456',
            'Yamaha',
            'Exciter',
            'Blue'
        );

        expect(success).toBe(true);
        expect(apiClient.put).toHaveBeenCalledWith('/drivers/me', {
            name: 'Nguyễn Văn A',
            license_number: 'GPLX123456',
        });
        expect(apiClient.post).toHaveBeenCalledWith('/drivers/vehicles', {
            plate_number: '59-X1 999.99',
            brand: 'Yamaha',
            model: 'Exciter',
            color: 'Blue',
        });

        const updatedDriver = useAuthStore.getState().driver;
        expect(updatedDriver?.name).toBe('Nguyễn Văn A');
        expect(updatedDriver?.vehiclePlate).toBe('59-X1 999.99');
        expect(updatedDriver?.licenseNumber).toBe('GPLX123456');
        expect(updatedDriver?.vehicleId).toBe('new-vehicle-456');
        expect(updatedDriver?.brand).toBe('Yamaha');
        expect(updatedDriver?.model).toBe('Exciter');
        expect(updatedDriver?.color).toBe('Blue');
        expect(useAuthStore.getState().isProfileComplete).toBe(true);
    });
});

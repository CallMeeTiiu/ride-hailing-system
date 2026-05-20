import { DriverProfile, TripData, TripStatus, ChatMessage } from '../types';

export const MOCK_DRIVER: DriverProfile = {
    id: 'drv_001',
    name: 'Nguyễn Văn Mạnh',
    phone: '+84987654321',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    rating: 4.95,
    vehiclePlate: '29A-999.99',
};

export const MOCK_TRIP: TripData = {
    id: 'trip_2026_xyz',
    customer: {
        id: 'cust_987',
        name: 'John Doe',
        phone: '+84123456789',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        rating: 4.9,
    },
    pickup: {
        address: '123 Sunshine Street',
        latitude: 21.028511,
        longitude: 105.804817,
    },
    dropoff: {
        address: '456 Moonlight Avenue',
        latitude: 21.037511,
        longitude: 105.815817,
    },
    fare: 75000, // 75,000 VND
    status: TripStatus.BOOKING_INCOMING,
    createdAt: '2026-05-20T16:50:00Z',
};

export const MOCK_CHAT_HISTORY: ChatMessage[] = [
    {
        id: 'msg_1',
        senderId: 'cust_987',
        text: 'Tôi đang đứng trước cửa quán cafe, anh tới chưa?',
        timestamp: '16:51',
        isDriver: false,
    },
    {
        id: 'msg_2',
        senderId: 'drv_001',
        text: 'Tôi đang di chuyển tới cổng, tầm 2 phút nữa có mặt nhé ạ.',
        timestamp: '16:52',
        isDriver: true,
    },
    {
        id: 'msg_3',
        senderId: 'cust_987',
        text: 'Dạ vâng.',
        timestamp: '16:52',
        isDriver: false,
    },
    {
        id: 'msg_4',
        senderId: 'cust_987',
        text: 'Tôi mặc áo màu vàng nhé.',
        timestamp: '16:53',
        isDriver: false,
    },
];

import { create } from 'zustand';
import { ChatMessage, TripData, TripStatus } from '../types';
import { toFrontendStatus } from '../utils/tripStatusMapper';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketClient';
import apiClient from '../services/apiClient';
import { useAuthStore } from './authStore';

interface TripState {
    tripStatus: TripStatus;
    currentTrip: TripData | null;
    setTripStatus: (status: TripStatus) => void;
    setCurrentTrip: (trip: TripData | null) => void;

    // Rating states
    customerMood: string | null;
    customerRating: number;
    ratingStep: 'mood' | 'star' | null;

    // Trip lifecycle actions
    toggleOnline: (online: boolean) => Promise<void>;
    receiveBooking: () => void;
    acceptTrip: () => Promise<void>;
    rejectTrip: () => void;
    confirmArrived: () => Promise<void>;
    startTrip: () => Promise<void>;
    finishTrip: () => Promise<void>;
    cancelTrip: () => Promise<void>;
    completeFinish: () => void;
    dismissCancel: () => void;

    // Rating actions
    submitMood: (moodId: string | null) => void;
    submitRating: (rating: number) => Promise<void>;

    // Chat States
    chatMessages: ChatMessage[];
    hasUnreadChat: boolean;
    setUnreadChat: (status: boolean) => void;
    addChatMessage: (msg: ChatMessage) => void;
    sendChatMessage: (text: string) => void;
    clearChat: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
    tripStatus: TripStatus.OFFLINE,
    currentTrip: null,
    customerMood: null,
    customerRating: 0,
    ratingStep: null,

    chatMessages: [],
    hasUnreadChat: false,
    setUnreadChat: (status) => set({ hasUnreadChat: status }),
    addChatMessage: (msg) => set((state) => ({
        chatMessages: [...state.chatMessages, msg],
        hasUnreadChat: true
    })),
    clearChat: () => set({ chatMessages: [], hasUnreadChat: false }),

    sendChatMessage: (text: string) => {
        const { currentTrip } = get();
        if (!currentTrip) return;

        const newMsg: ChatMessage = {
            id: `msg_drv_${Date.now()}`,
            senderId: 'DRIVER',
            text: text,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isDriver: true,
        };

        set((state) => ({ chatMessages: [...state.chatMessages, newMsg] }));

        const socket = getSocket();
        if (socket?.connected) {
            socket.emit('send_message', {
                trip_id: currentTrip.id,
                text: text,
                sender: 'DRIVER',
            });
        }
    },

    setTripStatus: (status) => set({ tripStatus: status }),
    setCurrentTrip: (trip) => set({ currentTrip: trip }),

    toggleOnline: async (online) => {
        try {
            await apiClient.patch('/drivers/availability', { is_active: online });
            if (online) {
                const token = useAuthStore.getState().token;
                if (token) {
                    disconnectSocket();

                    const socket = connectSocket(token);
                    console.log('[TripStore] Socket created, connecting to server...');

                    socket.off('server:ride_request');
                    socket.off('server:offer_expired');
                    socket.off('server:trip_cancelled');
                    socket.off('connect');
                    socket.off('receive_message');

                    socket.on('server:ride_request', (payload) => {
                        console.log('[TripStore] ✅ Received ride_request:', payload.trip_id);
                        const tripData: TripData = {
                            id: payload.trip_id,
                            customer: {
                                id: payload.customer_id || 'unknown',
                                name: payload.customer_name || 'Khách hàng',
                                phone: payload.customer_phone || '',
                                rating: payload.customer_rating || 5.0,
                                avatarUrl: payload.customer_avatar || '',
                            },
                            pickup: {
                                address: payload.pickup?.address || payload.pickup_address || '',
                                latitude: payload.pickup?.lat || payload.pickup_latitude,
                                longitude: payload.pickup?.lng || payload.pickup_longitude,
                            },
                            dropoff: {
                                address: payload.dropoff?.address || payload.dropoff_address || '',
                                latitude: payload.dropoff?.lat || payload.dropoff_latitude,
                                longitude: payload.dropoff?.lng || payload.dropoff_longitude,
                            },
                            fare: payload.estimated_fare || payload.fare || 0,
                            status: TripStatus.BOOKING_INCOMING,
                            createdAt: new Date().toISOString(),
                        };
                        set({
                            tripStatus: TripStatus.BOOKING_INCOMING,
                            currentTrip: tripData,
                        });
                    });

                    socket.on('server:offer_expired', () => {
                        if (get().tripStatus === TripStatus.BOOKING_INCOMING) {
                            set({ tripStatus: TripStatus.ONLINE, currentTrip: null });
                        }
                    });

                    socket.on('server:trip_cancelled', () => {
                        const trip = get().currentTrip;
                        if (trip) {
                            set({
                                tripStatus: TripStatus.CANCELED,
                                currentTrip: { ...trip, status: TripStatus.CANCELED },
                            });
                        }
                    });

                    socket.on('receive_message', (data: any) => {
                        if (data.sender !== 'DRIVER') {
                            console.log('=== TÀI XẾ NHẬN ĐƯỢC TIN NHẮN ===', data);
                            
                            const dateObj = data.timestamp ? new Date(data.timestamp) : new Date();
                            const formattedTime = dateObj.toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                            });

                            get().addChatMessage({
                            id: `msg_cust_${Date.now()}`,
                            senderId: 'CUSTOMER',
                            text: data.text,
                            timestamp: formattedTime,
                            isDriver: false,
                            });
                        }
                    });

                    socket.on('connect', async () => {
                        console.log('[TripStore] Socket connected, id:', socket.id);
                        const trip = get().currentTrip;
                        if (!trip?.id) return;
                        socket.emit('join_trip_room', { trip_id: trip.id });
                        try {
                            const res = await apiClient.get(`/rides/${trip.id}`);
                            const latestStatus = toFrontendStatus(res.data.status);
                            if (latestStatus !== get().tripStatus) {
                                console.log('[Socket] Reconnect sync:', get().tripStatus, '→', latestStatus);
                                set({
                                    tripStatus: latestStatus,
                                    currentTrip: { ...trip, status: latestStatus },
                                });
                            }
                        } catch (err) {
                            console.error('[Socket] Reconnect sync failed:', err);
                        }
                    });
                }
                set({ tripStatus: TripStatus.ONLINE });
            } else {
                disconnectSocket();
                set({ tripStatus: TripStatus.OFFLINE, currentTrip: null });
            }
        } catch (err) {
            console.error('[TripStore] toggleOnline failed:', err);
        }
    },

    receiveBooking: () => {
        // Được quản lý trực tiếp thông qua luồng WebSocket từ Gateway
    },

    acceptTrip: async () => {
        get().clearChat();
        const trip = get().currentTrip;
        if (!trip) return;
        try {
            const res = await apiClient.post(`/rides/${trip.id}/accept`);
            const beStatus = res.data.status; // "ACCEPTED"
            const feStatus = toFrontendStatus(beStatus); // TripStatus.ARRIVING
            const socket = getSocket();
            if (socket?.connected) {
                socket.emit('join_trip_room', { trip_id: trip.id });
            }
            set({
                tripStatus: feStatus,
                currentTrip: { ...trip, status: feStatus },
            });
        } catch (err) {
            console.error('[TripStore] acceptTrip failed:', err);
        }
    },

    rejectTrip: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },

    confirmArrived: async () => {
        const trip = get().currentTrip;
        if (!trip) return;
        try {
            await apiClient.patch(`/trips/${trip.id}/status`, { status: 'ARRIVED' });
            set({
                tripStatus: TripStatus.ARRIVED,
                currentTrip: { ...trip, status: TripStatus.ARRIVED },
            });
            setTimeout(() => {
                if (get().tripStatus === TripStatus.ARRIVED) {
                    set({
                        tripStatus: TripStatus.WAITING,
                        currentTrip: { ...trip, status: TripStatus.WAITING },
                    });
                }
            }, 500);
        } catch (err) {
            console.error('[TripStore] confirmArrived failed:', err);
        }
    },

    startTrip: async () => {
        const trip = get().currentTrip;
        if (!trip) return;
        try {
            await apiClient.patch(`/trips/${trip.id}/status`, { status: 'IN_PROGRESS' });
            set({
                tripStatus: TripStatus.SERVING,
                currentTrip: { ...trip, status: TripStatus.SERVING },
            });
        } catch (err) {
            console.error('[TripStore] startTrip failed:', err);
        }
    },

    finishTrip: async () => {
        const trip = get().currentTrip;
        if (!trip) return;
        try {
            await apiClient.patch(`/trips/${trip.id}/status`, { status: 'COMPLETED' });
            set({
                tripStatus: TripStatus.FINISHED,
                ratingStep: 'mood',
                customerMood: null,
                customerRating: 0,
                currentTrip: { ...trip, status: TripStatus.FINISHED },
            });
        } catch (err) {
            console.error('[TripStore] finishTrip failed:', err);
        }
        get().clearChat(); 
        set({ currentTrip: null, tripStatus: TripStatus.ONLINE });
    },

    cancelTrip: async () => {
        const trip = get().currentTrip;
        if (!trip) return;
        try {
            await apiClient.patch(`/trips/${trip.id}/status`, { status: 'CANCELLED_BY_DRIVER' });
            set({
                tripStatus: TripStatus.CANCELED,
                currentTrip: { ...trip, status: TripStatus.CANCELED },
            });
        } catch (err) {
            console.error('[TripStore] cancelTrip failed:', err);
        }
        get().clearChat();
        set({ currentTrip: null, tripStatus: TripStatus.ONLINE });
    },

    completeFinish: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
            ratingStep: null,
            customerMood: null,
            customerRating: 0,
        });
    },

    dismissCancel: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },

    submitMood: (moodId) => {
        set({
            customerMood: moodId,
            ratingStep: 'star',
        });
    },

    submitRating: async (rating) => {
        const trip = get().currentTrip;
        if (!trip) return;
        const currentMood = get().customerMood;
        try {
            await apiClient.post(`/rides/${trip.id}/rate`, {
                rating: rating,
                comment: currentMood || undefined,
            });
        } catch (err) {
            console.error('[TripStore] submitRating failed:', err);
        }

        // Hoàn tất luồng, cập nhật State về lại trạng thái chờ cuốc mới (ONLINE)
        set({
            customerRating: rating,
            ratingStep: null,
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },
}));

import { create } from 'zustand';
import { TripData, TripStatus } from '../types';
import { MOCK_TRIP } from '../data/mockData';

interface TripState {
    tripStatus: TripStatus;
    currentTrip: TripData | null;
    setTripStatus: (status: TripStatus) => void;
    setCurrentTrip: (trip: TripData | null) => void;

    // Trip lifecycle actions
    toggleOnline: (online: boolean) => void;
    receiveBooking: () => void;
    acceptTrip: () => void;
    rejectTrip: () => void;
    confirmArrived: () => void;
    startTrip: () => void;
    finishTrip: () => void;
    cancelTrip: () => void;
    completeFinish: () => void;
    dismissCancel: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
    tripStatus: TripStatus.OFFLINE,
    currentTrip: null,

    setTripStatus: (status) => set({ tripStatus: status }),
    setCurrentTrip: (trip) => set({ currentTrip: trip }),

    toggleOnline: (online) => {
        if (online) {
            set({ tripStatus: TripStatus.ONLINE });
        } else {
            set({ tripStatus: TripStatus.OFFLINE, currentTrip: null });
        }
    },

    receiveBooking: () => {
        if (get().tripStatus === TripStatus.ONLINE) {
            set({
                tripStatus: TripStatus.BOOKING_INCOMING,
                currentTrip: { ...MOCK_TRIP, status: TripStatus.BOOKING_INCOMING },
            });
        }
    },

    acceptTrip: () => {
        const current = get().currentTrip;
        if (current) {
            set({
                tripStatus: TripStatus.ARRIVING,
                currentTrip: { ...current, status: TripStatus.ARRIVING },
            });
        }
    },

    rejectTrip: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },

    confirmArrived: () => {
        const current = get().currentTrip;
        if (current) {
            set({
                tripStatus: TripStatus.ARRIVED,
                currentTrip: { ...current, status: TripStatus.ARRIVED },
            });
            // Auto-transition ARRIVED -> WAITING right away as confirmed in plan
            setTimeout(() => {
                if (get().tripStatus === TripStatus.ARRIVED) {
                    set({
                        tripStatus: TripStatus.WAITING,
                        currentTrip: { ...current, status: TripStatus.WAITING },
                    });
                }
            }, 500);
        }
    },

    startTrip: () => {
        const current = get().currentTrip;
        if (current) {
            set({
                tripStatus: TripStatus.SERVING,
                currentTrip: { ...current, status: TripStatus.SERVING },
            });
        }
    },

    finishTrip: () => {
        const current = get().currentTrip;
        if (current) {
            set({
                tripStatus: TripStatus.FINISHED,
                currentTrip: { ...current, status: TripStatus.FINISHED },
            });
        }
    },

    cancelTrip: () => {
        const current = get().currentTrip;
        if (current && (get().tripStatus === TripStatus.ARRIVING || get().tripStatus === TripStatus.WAITING)) {
            set({
                tripStatus: TripStatus.CANCELED,
                currentTrip: { ...current, status: TripStatus.CANCELED },
            });
        }
    },

    completeFinish: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },

    dismissCancel: () => {
        set({
            tripStatus: TripStatus.ONLINE,
            currentTrip: null,
        });
    },
}));

import { create } from 'zustand';
import type { RatingStep } from '../types';

interface TripStoreState {
    ratingStep: RatingStep;
    selectedMoodId: string | null;
    driverRating: number;
    isRatingSheetVisible: boolean;
    hasSelectedMood: boolean;
}

interface TripStoreActions {
    openRatingSheet: () => void;
    selectMood: (moodId: string | null) => void;
    submitMood: () => void;
    selectRating: (stars: number) => void;
    submitRating: () => void;
    cancelRating: () => void;
}

type TripStore = TripStoreState & TripStoreActions;

const initialState: TripStoreState = {
    ratingStep: 'mood',
    selectedMoodId: null,
    driverRating: 0,
    isRatingSheetVisible: false,
    hasSelectedMood: false,
};

export const useTripStore = create<TripStore>()((set, get) => ({
    ...initialState,

    openRatingSheet: () =>
        set({
            ratingStep: 'mood',
            selectedMoodId: null,
            driverRating: 0,
            isRatingSheetVisible: true,
            hasSelectedMood: false,
        }),

    selectMood: (moodId: string | null) =>
        set({
            selectedMoodId: moodId,
            hasSelectedMood: true,
        }),

    submitMood: () => {
        const { hasSelectedMood } = get();
        if (!hasSelectedMood) {
            return;
        }
        set({ ratingStep: 'star' });
    },

    selectRating: (stars: number) =>
        set({ driverRating: Math.min(5, Math.max(1, stars)) }),

    submitRating: () => {
        const { driverRating, selectedMoodId } = get();
        if (driverRating < 1) {
            return;
        }
        // Mock: log the rating data
        console.log('[RatingSubmitted]', {
            moodId: selectedMoodId,
            rating: driverRating,
        });
        set({ ...initialState });
    },

    cancelRating: () => set({ ...initialState }),
}));

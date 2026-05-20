import { create } from 'zustand';
import { DriverProfile } from '../types';
import { MOCK_DRIVER } from '../data/mockData';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    driver: DriverProfile | null;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isLoggedIn: false,
    token: null,
    driver: null,
    login: async (phone, password) => {
        // Mock network lag of 1 second
        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
        set({
            isLoggedIn: true,
            token: 'jwt_mock_token_2026',
            driver: MOCK_DRIVER,
        });
        return true;
    },
    logout: () => {
        set({ isLoggedIn: false, token: null, driver: null });
    },
}));

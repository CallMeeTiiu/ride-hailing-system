import { create } from 'zustand';
import { DriverProfile } from '../types';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    driver: DriverProfile | null;
    isLoading: boolean;
    error: string | null;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => void;
    loadToken: () => Promise<void>;
    fetchProfile: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isLoggedIn: false,
    token: null,
    driver: null,
    isLoading: false,
    error: null,

    login: async (phone, password) => {
        set({ isLoading: true, error: null });
        try {
            const res = await apiClient.post('/auth/driver/login', {
                phone_number: phone,
                password: password,
            });
            const { access_token, refresh_token } = res.data;
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', refresh_token);
            set({ isLoggedIn: true, token: access_token, isLoading: false });

            // Fetch profile — rollback login nếu thất bại
            const profileOk = await get().fetchProfile();
            if (!profileOk) {
                get().logout();
                set({ error: 'Không thể tải thông tin tài xế. Vui lòng thử lại.' });
                return false;
            }
            return true;
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Đăng nhập thất bại';
            set({ isLoading: false, error: msg });
            return false;
        }
    },

    logout: () => {
        AsyncStorage.removeItem('access_token');
        AsyncStorage.removeItem('refresh_token');
        set({ isLoggedIn: false, token: null, driver: null, error: null });
    },

    loadToken: async () => {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
            set({ isLoggedIn: true, token });
            const profileOk = await get().fetchProfile();
            if (!profileOk) {
                get().logout();
            }
        }
    },

    fetchProfile: async (): Promise<boolean> => {
        try {
            const res = await apiClient.get('/drivers/me');
            const profile = res.data.profile;
            if (profile) {
                set({
                    driver: {
                        id: res.data.userId || String(res.data.id),
                        name: profile.full_name || '',
                        phone: profile.phone || '',
                        avatarUrl: profile.avatar_url || '',
                        rating: profile.rating || 0,
                        vehiclePlate: profile.vehicle_plate || '',
                    },
                });
                return true;
            }
            return false;
        } catch (err) {
            console.error('[AuthStore] fetchProfile failed:', err);
            return false;
        }
    },
}));


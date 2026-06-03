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
    updateDriverProfile: (name: string, vehiclePlate: string, licenseNumber?: string) => Promise<boolean>;
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
            const { access_token, refresh_token, user } = res.data;
            await AsyncStorage.setItem('access_token', access_token);
            await AsyncStorage.setItem('refresh_token', refresh_token);
            if (user && user.phone_number) {
                await AsyncStorage.setItem('phone_number', user.phone_number);
            } else {
                await AsyncStorage.setItem('phone_number', phone);
            }
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
            console.log('[AuthStore] Login error detail:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                code: err.code,
            });

            let msg = 'Đăng nhập thất bại';
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.message === 'Network Error') {
                msg = 'Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng.';
            }
            set({ isLoading: false, error: msg });
            return false;
        }
    },

    logout: () => {
        AsyncStorage.removeItem('access_token');
        AsyncStorage.removeItem('refresh_token');
        AsyncStorage.removeItem('phone_number');
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
            
            const cachedPhone = await AsyncStorage.getItem('phone_number') || '';

            // Fetch vehicle
            let vehiclePlate = 'Chưa cập nhật';
            let vehicleId = '';
            try {
                const vehicleRes = await apiClient.get('/drivers/vehicles');
                if (vehicleRes.data && vehicleRes.data.length > 0) {
                    vehiclePlate = vehicleRes.data[0].plate_number || 'Chưa cập nhật';
                    vehicleId = vehicleRes.data[0].id;
                }
            } catch (vErr) {
                console.log('[AuthStore] Fetch vehicles failed:', vErr);
            }

            if (profile) {
                set({
                    driver: {
                        id: res.data.userId || String(res.data.id),
                        name: profile.name || '',
                        phone: cachedPhone || profile.phone || '',
                        avatarUrl: profile.avatar_url || 'https://ui-avatars.com/api/?name=TX&background=F5A623&color=fff',
                        rating: profile.rating || 5.0,
                        vehiclePlate: vehiclePlate,
                        licenseNumber: profile.license_number || '',
                        vehicleId: vehicleId,
                    },
                });
                return true;
            }

            // Tài khoản mới, backend trả null. Frontend tự tạo "phao cứu sinh" và đồng bộ về DB
            const defaultName = 'Tài xế mới';
            const defaultAvatar = 'https://ui-avatars.com/api/?name=TX&background=F5A623&color=fff';

            try {
                await apiClient.put('/drivers/me', {
                    name: defaultName,
                    avatar_url: defaultAvatar,
                });
            } catch (putErr: any) {
                console.warn('[AuthStore] Auto-creation of driver profile on backend failed:', putErr.message);
            }

            set({
                driver: {
                    id: res.data.userId || 'new-driver',
                    name: defaultName,
                    phone: cachedPhone,
                    rating: 5.0,
                    avatarUrl: defaultAvatar,
                    vehiclePlate: 'Chưa cập nhật',
                    licenseNumber: '',
                    vehicleId: '',
                },
            });
            return true;
        } catch (err: any) {
            if (err.response?.status === 401) {
                console.log('[AuthStore] Session expired or invalid token.');
            } else if (err.message === 'Network Error' || err.code === 'ECONNABORTED') {
                console.log('[AuthStore] Backend unreachable, skipping profile fetch.');
            } else {
                console.warn('[AuthStore] fetchProfile failed:', err.message || err);
            }
            return false;
        }
    },

    updateDriverProfile: async (name: string, vehiclePlate: string, licenseNumber?: string) => {
        const driver = get().driver;
        if (!driver) return false;

        set({ isLoading: true, error: null });
        try {
            // 1. Cập nhật profile cá nhân lên DB
            await apiClient.put('/drivers/me', {
                name: name,
                license_number: licenseNumber || '',
            });

            // 2. Cập nhật biển số xe lên DB
            let updatedVehicleId = driver.vehicleId || '';
            const plateClean = vehiclePlate.trim();
            
            if (plateClean && plateClean !== 'Chưa cập nhật') {
                if (updatedVehicleId) {
                    await apiClient.put(`/drivers/vehicles/${updatedVehicleId}`, {
                        plate_number: plateClean,
                        brand: 'Xe máy',
                        model: 'Thông thường',
                        color: 'Đen',
                    });
                } else {
                    const vRes = await apiClient.post('/drivers/vehicles', {
                        plate_number: plateClean,
                        brand: 'Xe máy',
                        model: 'Thông thường',
                        color: 'Đen',
                    });
                    if (vRes.data && vRes.data.id) {
                        updatedVehicleId = vRes.data.id;
                    }
                }
            }

            // 3. Cập nhật local state
            set({
                isLoading: false,
                driver: {
                    ...driver,
                    name: name,
                    vehiclePlate: plateClean || 'Chưa cập nhật',
                    licenseNumber: licenseNumber || '',
                    vehicleId: updatedVehicleId,
                }
            });
            return true;
        } catch (err: any) {
            console.error('[AuthStore] updateDriverProfile failed:', err);
            set({ isLoading: false, error: err.response?.data?.message || 'Cập nhật hồ sơ thất bại' });
            return false;
        }
    },
}));


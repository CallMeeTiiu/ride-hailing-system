import { create } from 'zustand';
import { DriverProfile } from '../types';
import apiClient from '../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface AuthState {
    isLoggedIn: boolean;
    isProfileComplete: boolean;
    token: string | null;
    driver: DriverProfile | null;
    isLoading: boolean;
    error: string | null;
    login: (phone: string, password: string) => Promise<boolean>;
    logout: () => void;
    loadToken: () => Promise<void>;
    fetchProfile: () => Promise<boolean>;
    updateDriverProfile: (
        name: string,
        vehiclePlate: string,
        licenseNumber?: string,
        brand?: string,
        model?: string,
        color?: string
    ) => Promise<boolean>;
    uploadAvatar: (file: { uri: string; name?: string; type?: string }) => Promise<string | null>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isLoggedIn: false,
    isProfileComplete: false,
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
            console.log('🔑 DRIVER ACCESS_TOKEN ON EMULATOR:', token);
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
            let brand = '';
            let model = '';
            let color = '';
            try {
                const vehicleRes = await apiClient.get('/drivers/vehicles');
                if (vehicleRes.data && vehicleRes.data.length > 0) {
                    vehiclePlate = vehicleRes.data[0].plate_number || 'Chưa cập nhật';
                    vehicleId = vehicleRes.data[0].id;
                    brand = vehicleRes.data[0].brand || '';
                    model = vehicleRes.data[0].model || '';
                    color = vehicleRes.data[0].color || '';
                }
            } catch (vErr) {
                console.log('[AuthStore] Fetch vehicles failed:', vErr);
            }

            if (profile) {
                const isComplete = profile.name && 
                                   profile.name !== 'Tài xế mới' &&
                                   vehiclePlate && 
                                   vehiclePlate !== 'Chưa cập nhật' &&
                                   profile.license_number &&
                                   brand &&
                                   model &&
                                   color;
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
                        brand: brand,
                        model: model,
                        color: color,
                    },
                    isProfileComplete: !!isComplete,
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
                isProfileComplete: false,
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

    updateDriverProfile: async (
        name: string,
        vehiclePlate: string,
        licenseNumber?: string,
        brand?: string,
        model?: string,
        color?: string
    ) => {
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
            const brandClean = brand || driver.brand || 'Xe máy';
            const modelClean = model || driver.model || 'Thông thường';
            const colorClean = color || driver.color || 'Đen';
            
            if (plateClean && plateClean !== 'Chưa cập nhật') {
                if (updatedVehicleId) {
                    await apiClient.put(`/drivers/vehicles/${updatedVehicleId}`, {
                        plate_number: plateClean,
                        brand: brandClean,
                        model: modelClean,
                        color: colorClean,
                    });
                } else {
                    const vRes = await apiClient.post('/drivers/vehicles', {
                        plate_number: plateClean,
                        brand: brandClean,
                        model: modelClean,
                        color: colorClean,
                    });
                    if (vRes.data && vRes.data.id) {
                        updatedVehicleId = vRes.data.id;
                    }
                }
            }

            // 3. Cập nhật local state
            const isCompleteNow = name && 
                                  name !== 'Tài xế mới' && 
                                  plateClean && 
                                  plateClean !== 'Chưa cập nhật' && 
                                  licenseNumber &&
                                  brandClean &&
                                  modelClean &&
                                  colorClean;
            set({
                isLoading: false,
                isProfileComplete: !!isCompleteNow,
                driver: {
                    ...driver,
                    name: name,
                    vehiclePlate: plateClean || 'Chưa cập nhật',
                    licenseNumber: licenseNumber || '',
                    vehicleId: updatedVehicleId,
                    brand: brandClean,
                    model: modelClean,
                    color: colorClean,
                }
            });
            return true;
        } catch (err: any) {
            console.error('[AuthStore] updateDriverProfile failed:', err);
            set({ isLoading: false, error: err.response?.data?.message || 'Cập nhật hồ sơ thất bại' });
            return false;
        }
    },

    uploadAvatar: async (file: { uri: string; name?: string; type?: string }) => {
        const driver = get().driver;
        if (!driver) return null;

        set({ isLoading: true, error: null });
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: Platform.OS === 'android' ? file.uri : file.uri.replace('file://', ''),
                type: file.type || 'image/jpeg',
                name: file.name || 'avatar.jpg',
            } as any);

            const res = await apiClient.post('/drivers/me/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedAvatar = res.data.avatar_url;
            set({
                isLoading: false,
                driver: {
                    ...driver,
                    avatarUrl: updatedAvatar,
                }
            });
            return updatedAvatar;
        } catch (err: any) {
            console.error('[AuthStore] uploadAvatar failed:', err);
            set({ isLoading: false, error: 'Tải ảnh đại diện lên server thất bại' });
            return null;
        }
    },
}));

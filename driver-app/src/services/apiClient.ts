import axios from 'axios';
import { CONFIG } from './config';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
    baseURL: CONFIG.API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: lấy token từ Zustand (RAM)
apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: bắt 401 → trigger logout
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    },
);

export default apiClient;

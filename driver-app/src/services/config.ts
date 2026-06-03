import { Platform } from 'react-native';

// Android emulator dùng 10.0.2.2 để trỏ về localhost máy host
// iOS simulator dùng localhost trực tiếp
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Render deployed server
const RENDER_HOST = 'https://ride-hailing-system-nuf0.onrender.com';

export const CONFIG = {
    // Chuyển sang localhost: đổi RENDER_HOST thành `http://${LOCAL_HOST}:3000`
    API_BASE_URL: RENDER_HOST,
    SOCKET_URL: RENDER_HOST,
    LOCATION_INTERVAL_MS: 5000,
};

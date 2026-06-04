import { Platform } from 'react-native';

// Android emulator dùng 10.0.2.2 để trỏ về localhost máy host
// iOS simulator dùng localhost trực tiếp
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

// Render deployed server (chỉ dùng khi test production)
// const RENDER_HOST = 'https://ride-hailing-system-nuf0.onrender.com';

export const CONFIG = {
    // ✅ Localhost: Redis + PostgreSQL đang chạy local
    // API_BASE_URL: `http://${LOCAL_HOST}:3000`,
    // SOCKET_URL: `http://${LOCAL_HOST}:3000`,

    // ✅ Render deployed server
    API_BASE_URL: 'https://ride-hailing-system-nuf0.onrender.com',
    SOCKET_URL: 'https://ride-hailing-system-nuf0.onrender.com',
    LOCATION_INTERVAL_MS: 5000,
};

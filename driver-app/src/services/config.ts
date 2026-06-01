import { Platform } from 'react-native';

// Android emulator dùng 10.0.2.2 để trỏ về localhost máy host
// iOS simulator dùng localhost trực tiếp
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const CONFIG = {
    API_BASE_URL: `http://${LOCAL_HOST}:3000`,
    SOCKET_URL: `http://${LOCAL_HOST}:3000`,
    LOCATION_INTERVAL_MS: 5000,
};

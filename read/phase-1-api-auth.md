# Phase 1: API Client + Authentication

> **Phụ thuộc:** Phase 0 (TripStatus Mapper) phải hoàn thành trước.
> **Thời gian ước tính:** 1-2 ngày

---

## Mục Tiêu

Thay thế mock login bằng API thực. Sau phase này:
- Driver mở app → Login bằng phone + password → nhận JWT từ BE
- Token lưu vào AsyncStorage, tự khôi phục khi mở lại app
- Profile tải từ `GET /drivers/me` thay vì `MOCK_DRIVER`
- API call 401 → tự động logout

---

## Dependencies Cần Cài

```bash
cd driver-app
npm install axios socket.io-client @react-native-async-storage/async-storage
```

---

## Files Cần Tạo / Sửa

### [NEW] `config.ts` — `driver-app/src/services/config.ts`

```typescript
import { Platform } from 'react-native';

// Android emulator dùng 10.0.2.2 để trỏ về localhost máy host
// iOS simulator dùng localhost trực tiếp
const LOCAL_HOST = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';

export const CONFIG = {
  API_BASE_URL: `http://${LOCAL_HOST}:3000`,
  SOCKET_URL: `http://${LOCAL_HOST}:3000`,
  LOCATION_INTERVAL_MS: 5000,
};
```

---

### [NEW] `apiClient.ts` — `driver-app/src/services/apiClient.ts`

Tạo Axios instance + interceptors:

> [!IMPORTANT]
> **Review fix:** Request interceptor lấy token từ Zustand store (RAM) thay vì AsyncStorage (disk I/O).
> `useAuthStore.getState().token` = đọc RAM (~0ms) vs `AsyncStorage.getItem()` = đọc disk (~5-15ms mỗi call).

```typescript
import axios from 'axios';
import { CONFIG } from './config';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: lấy token từ Zustand (RAM) — không cần async
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
      // logout() đã xử lý xoá AsyncStorage bên trong
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
```

---

### [NEW] `socketClient.ts` — `driver-app/src/services/socketClient.ts`

Socket.IO client (chưa kết nối — Phase 2 mới dùng):

> [!IMPORTANT]
> **Review fix:** Truyền `token` trực tiếp qua parameter thay vì đọc từ AsyncStorage.
> Lý do: Nếu user logout rồi login lại, AsyncStorage có thể trả token cũ chưa kịp cập nhật.
> Caller sẽ lấy token từ `useAuthStore.getState().token` — luôn đảm bảo token mới nhất.

```typescript
import { io, Socket } from 'socket.io-client';
import { CONFIG } from './config';

let socket: Socket | null = null;

/**
 * Kết nối Socket.IO với token truyền trực tiếp.
 * Caller lấy token từ useAuthStore.getState().token
 * để đảm bảo luôn dùng token mới nhất.
 */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;

  socket = io(CONFIG.SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 3000,
    reconnectionAttempts: 10,
  });

  socket.on('connect', () => console.log('[Socket] Connected:', socket?.id));
  socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));
  socket.on('connect_error', (err) => console.error('[Socket] Error:', err.message));

  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
```

---

### [MODIFY] `authStore.ts` — `driver-app/src/store/authStore.ts`

Thay đổi lớn — từ mock sang API thật:

```diff
-import { MOCK_DRIVER } from '../data/mockData';
+import apiClient from '../services/apiClient';
+import AsyncStorage from '@react-native-async-storage/async-storage';

 interface AuthState {
     isLoggedIn: boolean;
     token: string | null;
     driver: DriverProfile | null;
+    isLoading: boolean;
+    error: string | null;
     login: (phone: string, password: string) => Promise<boolean>;
     logout: () => void;
+    loadToken: () => Promise<void>;
+    fetchProfile: () => Promise<void>;
 }

 export const useAuthStore = create<AuthState>((set, get) => ({
     isLoggedIn: false,
     token: null,
     driver: null,
+    isLoading: false,
+    error: null,

     login: async (phone, password) => {
-        await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
-        set({
-            isLoggedIn: true,
-            token: 'jwt_mock_token_2026',
-            driver: MOCK_DRIVER,
-        });
-        return true;
+        set({ isLoading: true, error: null });
+        try {
+            const res = await apiClient.post('/auth/driver/login', {
+                phone_number: phone,
+                password: password,
+            });
+            const { access_token, refresh_token, user } = res.data;
+            await AsyncStorage.setItem('access_token', access_token);
+            await AsyncStorage.setItem('refresh_token', refresh_token);
+            set({ isLoggedIn: true, token: access_token, isLoading: false });
+
+            // Fetch profile — rollback login nếu thất bại
+            const profileOk = await get().fetchProfile();
+            if (!profileOk) {
+                // Profile fetch failed → rollback: user thấy login screen, không bị kẹt
+                get().logout();
+                set({ error: 'Không thể tải thông tin tài xế. Vui lòng thử lại.' });
+                return false;
+            }
+            return true;
+        } catch (err: any) {
+            const msg = err.response?.data?.message || 'Đăng nhập thất bại';
+            set({ isLoading: false, error: msg });
+            return false;
+        }
     },

     logout: () => {
+        AsyncStorage.multiRemove(['access_token', 'refresh_token']);
         set({ isLoggedIn: false, token: null, driver: null, error: null });
     },

+    loadToken: async () => {
+        const token = await AsyncStorage.getItem('access_token');
+        if (token) {
+            set({ isLoggedIn: true, token });
+            const profileOk = await get().fetchProfile();
+            if (!profileOk) {
+                // Token cũ nhưng profile fail → force re-login
+                get().logout();
+            }
+        }
+    },

+    // Trả về boolean để caller biết thành công hay thất bại
+    fetchProfile: async (): Promise<boolean> => {
+        try {
+            const res = await apiClient.get('/drivers/me');
+            const profile = res.data.profile;
+            if (profile) {
+                set({
+                    driver: {
+                        id: res.data.userId,
+                        name: profile.full_name || '',
+                        phone: profile.phone || '',
+                        avatarUrl: profile.avatar_url || '',
+                        rating: profile.rating || 0,
+                        vehiclePlate: profile.vehicle_plate || '',
+                    },
+                });
+                return true;
+            }
+            return false;
+        } catch (err) {
+            console.error('[AuthStore] fetchProfile failed:', err);
+            return false;
+        }
+    },
 }));
```

---

### [MODIFY] `LoginScreen.tsx`

Thay đổi nhỏ — hiển thị error từ server:

| Vùng code | Thay đổi |
|-----------|----------|
| `handleLogin()` | Gọi `authStore.login()` (đã là API call) — trước đó cũng gọi nhưng giờ nó gọi API thật |
| Error display | Thêm hiển thị `authStore.error` nếu có |
| Loading state | Dùng `authStore.isLoading` thay vì local state |

---

### [MODIFY] `RootNavigator.tsx`

Gọi `loadToken()` khi app mở:

```diff
+import { useEffect } from 'react';

 const RootNavigator = () => {
     const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
+    const loadToken = useAuthStore((s) => s.loadToken);
+
+    useEffect(() => { loadToken(); }, []);

     return (
         <NavigationContainer>
             {isLoggedIn ? <MainTab /> : <AuthStack />}
         </NavigationContainer>
     );
 };
```

---

## Verification

### Manual Test
1. Start BE: `cd backend && npm run start:dev`
2. Mở Swagger: `http://localhost:3000/api/docs`
3. Tạo driver qua `POST /auth/driver/register` → body: `{ "phone_number": "+84987654321", "password": "123456" }`
4. Mở driver-app → Nhập phone + password → Verify:
   - ✅ Login thành công → chuyển sang MainTab
   - ✅ Tắt app, mở lại → tự đăng nhập (loadToken)
   - ✅ Sai mật khẩu → hiển thị lỗi tiếng Việt từ BE

### Lỗi phổ biến cần kiểm tra
- `Network Error` → Kiểm tra `CONFIG.API_BASE_URL` đúng IP chưa
- `401 Unauthorized` → Token hết hạn / sai → auto-logout hoạt động không
- AsyncStorage persist → Kill app hoàn toàn, mở lại, vẫn logged in không

---

## Deliverables

| File | Action | LOC |
|------|--------|-----|
| `driver-app/src/services/config.ts` | NEW | ~10 |
| `driver-app/src/services/apiClient.ts` | NEW | ~35 |
| `driver-app/src/services/socketClient.ts` | NEW | ~35 |
| `driver-app/src/store/authStore.ts` | MODIFY | ~80 (rewrite) |
| `driver-app/src/screens/LoginScreen.tsx` | MODIFY | ~15 lines changed |
| `driver-app/src/navigation/RootNavigator.tsx` | MODIFY | ~5 lines added |

# Phase 3: Profile, Polish & Cleanup

> **Phụ thuộc:** Phase 0 + 1 + 2 hoàn thành.
> **Thời gian ước tính:** 1 ngày

---

## Mục Tiêu

Sau phase này:
- ProfileScreen hiển thị data thật từ BE
- LoginScreen hiển thị lỗi server rõ ràng
- Mock data bị xoá hoàn toàn
- Code sạch, không còn import thừa

---

## Files Cần Sửa

### [MODIFY] `ProfileScreen.tsx`

| Vùng code | Thay đổi |
|-----------|----------|
| Data source | Thay `MOCK_DRIVER` → `authStore.driver` (đã fetch từ Phase 1) |
| Stats row | Fetch từ `GET /drivers/trips/history` → count trips |
| Stats loading | Hiển thị placeholder `–` hoặc skeleton nhấp nháy trong lúc chờ API, tránh flash `0` → số thật |
| Sign out | `authStore.logout()` → clear AsyncStorage + navigate AuthStack |
| Avatar | Dùng `driver.avatarUrl` từ store (hoặc placeholder nếu null) |

```diff
 const ProfileScreen = () => {
-    const driver = MOCK_DRIVER;
+    const driver = useAuthStore((s) => s.driver);
+    const logout = useAuthStore((s) => s.logout);
+    const navigation = useNavigation();

     const handleSignOut = () => {
-        // TODO: implement
+        logout();
+        // RootNavigator sẽ tự chuyển về AuthStack vì isLoggedIn = false
     };
```

---

### [MODIFY] `LoginScreen.tsx`

| Vùng code | Thay đổi |
|-----------|----------|
| Error display | Hiển thị `authStore.error` (VD: "Thông tin đăng nhập không chính xác") |
| Loading state | Dùng `authStore.isLoading` → disable button + spinner |
| Local state | Xoá `isLoading` local → dùng store |

```diff
 const LoginScreen = () => {
-    const [isLoading, setIsLoading] = useState(false);
+    const isLoading = useAuthStore((s) => s.isLoading);
+    const error = useAuthStore((s) => s.error);

     const handleLogin = async () => {
-        setIsLoading(true);
         const success = await login(phone, password);
-        setIsLoading(false);
         if (!success) {
-            Alert.alert('Lỗi', 'Sai thông tin đăng nhập');
+            // Error đã được set trong store, hiển thị bên dưới form
         }
     };

+    // Hiển thị error message từ server
+    {error && <Text style={styles.errorText}>{error}</Text>}
```

---

### [DELETE / CLEANUP] Mock files

| File | Action | Lý do |
|------|--------|-------|
| `driver-app/src/data/mockData.ts` | **GIỮ LẠI** (nhưng chỉ còn dùng cho `MOCK_CHAT_HISTORY`) | ChatScreen vẫn mock |
| Import `MOCK_DRIVER` trong `authStore.ts` | XÓA | Đã thay bằng API |
| Import `MOCK_TRIP` trong `tripStore.ts` | XÓA | Đã thay bằng Socket data |

> **Lưu ý:** `MOCK_CHAT_HISTORY` vẫn giữ vì ChatScreen chưa có BE support (BE chưa có Chat module).

---

### [MODIFY] Type definitions — `types/index.ts`

Nếu cần, bổ sung fields cho `DriverProfile` để khớp với response BE:

```diff
 export interface DriverProfile {
     id: string;
     name: string;
     phone: string;
     avatarUrl: string;
     rating: number;
     vehiclePlate: string;
+    email?: string;
+    totalTrips?: number;
+    acceptanceRate?: number;
 }
```

---

## Verification

### Manual Test

1. **Profile screen:**
   - ✅ Tên + phone + avatar = data từ BE (không phải "Nguyễn Văn Mạnh" hardcoded)
   - ✅ Rating badge = số thực từ DB
   - ✅ Stats row hiển thị `–` hoặc skeleton khi đang fetch, không flash `0`
   - ✅ Sign out → quay về LoginScreen → mở lại app vẫn ở LoginScreen

2. **Login screen:**
   - ✅ Nhập sai password → hiển thị "Thông tin đăng nhập không chính xác" (từ BE)
   - ✅ Nhập đúng → chuyển sang MainTab
   - ✅ Loading spinner khi đang gọi API

3. **Cleanup check:**
   - ✅ `MOCK_DRIVER` không còn import ở bất kỳ file nào (trừ mockData.ts)
   - ✅ `MOCK_TRIP` không còn import ở bất kỳ file nào (trừ mockData.ts)
   - ✅ App build thành công: `npx react-native run-android`

---

## Deliverables

| File | Action | LOC |
|------|--------|-----|
| `driver-app/src/screens/ProfileScreen.tsx` | MODIFY | ~20 lines changed |
| `driver-app/src/screens/LoginScreen.tsx` | MODIFY | ~15 lines changed |
| `driver-app/src/types/index.ts` | MODIFY | ~3 lines added |
| `driver-app/src/store/authStore.ts` | CLEANUP | Remove MOCK_DRIVER import |
| `driver-app/src/store/tripStore.ts` | CLEANUP | Remove MOCK_TRIP import |

---

## Tổng Kết Toàn Bộ 4 Phases

| Phase | Focus | Files | Effort |
|-------|-------|-------|--------|
| **0** | TripStatus Mapping | 1 NEW | 30 phút |
| **1** | API Client + Auth | 3 NEW + 3 MODIFY | 1-2 ngày |
| **2** | Trip Lifecycle (REST + Socket) | 1 NEW + 3 MODIFY | 2-3 ngày |
| **3** | Profile + Polish + Cleanup | 5 MODIFY | 1 ngày |
| **Tổng** | | **5 NEW + 11 MODIFY** | **~5-7 ngày** |

### Sau khi hoàn thành tất cả phases:

```
Driver App Integration:  0%  →  ~70%
Backend sử dụng:        55%  →  ~65%  (driver-app đã gọi API thật)
Tổng dự án:             ~40% →  ~55%
```

---

## Review Feedback Đã Tích Hợp

| # | Góp ý | Trạng thái |
|---|--------|------------|
| 1 | Dọn rác `MOCK_DRIVER` / `MOCK_TRIP`, giữ `MOCK_CHAT_HISTORY` | ✅ Đã có trong plan |
| 2 | `authStore.error` inline dưới form thay vì Alert | ✅ Đã có trong plan |
| 3 | Luồng đăng xuất chuẩn qua `logout()` | ✅ Đã có trong plan |
| 4 | **Loading skeleton/placeholder cho Stats row** khi chờ API | ✅ **Đã bổ sung** |

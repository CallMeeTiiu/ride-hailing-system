# Phase 2: Trip Lifecycle — REST + Socket.IO

> **Phụ thuộc:** Phase 0 + Phase 1 phải hoàn thành.
> **Thời gian ước tính:** 2-3 ngày (phase nặng nhất)

---

## Mục Tiêu

Sau phase này, toàn bộ luồng chuyến đi hoạt động thực tế:
- Toggle Online → Socket connect + API availability
- Nhận cuốc từ BE qua Socket (thay mock setTimeout)
- Accept/Arrived/Start/Finish → gọi API + Socket notify
- GPS stream liên tục khi online
- Rating gửi về BE thay vì console.log

---

## Files Cần Tạo / Sửa

### [MODIFY] `tripStore.ts` — Rewrite lớn

Đây là thay đổi **nặng nhất** trong toàn bộ kế hoạch. Mỗi action phải:
1. Gọi API tương ứng
2. Dùng `toBackendStatus()` / `toFrontendStatus()` để convert trạng thái
3. Cập nhật local state chỉ SAU KHI API thành công
4. Xử lý lỗi (rollback state nếu API fail)

#### Chi tiết từng action:

> [!IMPORTANT]
> **Review fix #1:** Tất cả action **KHÔNG nhận `tripId` parameter** từ UI.
> Mọi hàm đều lấy `get().currentTrip!.id` trực tiếp từ store bên trong.
> UI chỉ cần gọi `acceptTrip()`, `confirmArrived()`, `cancelTrip()`... không truyền gì.

| Action | API Call | Status Mapping | Ghi chú |
|--------|----------|---------------|---------|
| `toggleOnline(true)` | `PATCH /drivers/availability` body `{ is_active: true }` | UI-only (ONLINE) | + `connectSocket()` |
| `toggleOnline(false)` | `PATCH /drivers/availability` body `{ is_active: false }` | UI-only (OFFLINE) | + `disconnectSocket()` |
| `receiveBooking()` | *(không gọi API — lắng nghe Socket)* | `toFrontendStatus('PENDING')` → BOOKING_INCOMING | Data từ `server:ride_request` event |
| `acceptTrip()` | `POST /rides/:id/accept` (id từ store) | `toFrontendStatus('ACCEPTED')` → ARRIVING | Chờ response 200 rồi mới set state |
| `rejectTrip()` | *(không gọi API — chỉ set ONLINE)* | UI-only | Cuốc tự expire ở BE |
| `confirmArrived()` | `PATCH /trips/:id/status` body `{ status: 'ARRIVED' }` | `toBackendStatus(ARRIVED)` → `'ARRIVED'` | id từ store |
| `startTrip()` | `PATCH /trips/:id/status` body `{ status: 'IN_PROGRESS' }` | `toBackendStatus(SERVING)` → `'IN_PROGRESS'` | **Chú ý mapping!** |
| `finishTrip()` | `PATCH /trips/:id/status` body `{ status: 'COMPLETED' }` | `toBackendStatus(FINISHED)` → `'COMPLETED'` | Auto-tính tiền ở BE |
| `cancelTrip()` | `POST /rides/:id/cancel` | `toBackendStatus(CANCELED)` → `'CANCELLED_BY_DRIVER'` | id từ store |
| `submitRating(rating)` | `POST /rides/:id/rate` body `{ rating, comment }` | *(không mapping)* | id từ store |

#### Pseudo-code mẫu cho `acceptTrip`:

```typescript
// KHÔNG có parameter — tripId lấy từ store
acceptTrip: async () => {
    const tripId = get().currentTrip?.id;
    if (!tripId) return;

    try {
        const res = await apiClient.post(`/rides/${tripId}/accept`);
        const beStatus = res.data.status; // "ACCEPTED"
        const feStatus = toFrontendStatus(beStatus); // TripStatus.ARRIVING

        set({
            tripStatus: feStatus,
            currentTrip: {
                ...get().currentTrip!,
                status: feStatus,
            },
        });
    } catch (err) {
        console.error('[TripStore] acceptTrip failed:', err);
        // Giữ nguyên state cũ — không set ARRIVING nếu API fail
    }
},
```

#### Socket event listeners (setup khi toggleOnline):

```typescript
// Trong toggleOnline(true), sau khi connectSocket():
const socket = getSocket();

socket.on('server:ride_request', (payload) => {
    // payload = { trip_id, pickup, dropoff, estimated_fare, ... }
    const tripData: TripData = {
        id: payload.trip_id,
        customer: payload.customer,
        pickup: payload.pickup,
        dropoff: payload.dropoff,
        fare: payload.estimated_fare,
        status: toFrontendStatus('PENDING'), // → BOOKING_INCOMING
        createdAt: new Date().toISOString(),
    };
    set({
        tripStatus: TripStatus.BOOKING_INCOMING,
        currentTrip: tripData,
    });
});

socket.on('server:offer_expired', () => {
    if (get().tripStatus === TripStatus.BOOKING_INCOMING) {
        set({ tripStatus: TripStatus.ONLINE, currentTrip: null });
    }
});

socket.on('server:trip_cancelled', (payload) => {
    set({
        tripStatus: TripStatus.CANCELED,
        currentTrip: { ...get().currentTrip!, status: TripStatus.CANCELED },
    });
});

// ⚡ REVIEW FIX #2: Reconnect sync
// Khi Socket reconnect sau mất mạng, fetch lại trạng thái chuyến đi từ API
// để tránh kẹt UI (VD: khách huỷ cuốc lúc tài xế trong hầm → lỡ mất event)
socket.on('connect', async () => {
    const trip = get().currentTrip;
    if (!trip?.id) return;

    try {
        const res = await apiClient.get(`/rides/${trip.id}`);
        const latestStatus = toFrontendStatus(res.data.status);

        // Chỉ cập nhật nếu status đã thay đổi so với local
        if (latestStatus !== get().tripStatus) {
            console.log('[Socket] Reconnect sync:', get().tripStatus, '→', latestStatus);
            if (latestStatus === TripStatus.CANCELED) {
                set({
                    tripStatus: TripStatus.CANCELED,
                    currentTrip: { ...trip, status: TripStatus.CANCELED },
                });
            } else if (latestStatus === TripStatus.FINISHED) {
                set({
                    tripStatus: TripStatus.FINISHED,
                    currentTrip: { ...trip, status: TripStatus.FINISHED },
                });
            } else {
                set({
                    tripStatus: latestStatus,
                    currentTrip: { ...trip, status: latestStatus },
                });
            }
        }
    } catch (err) {
        console.error('[Socket] Reconnect sync failed:', err);
    }
});
```

---

### [NEW] `useLocationStream.ts` — `driver-app/src/hooks/useLocationStream.ts`

GPS tracking hook — emit vị trí liên tục khi driver online:

```typescript
import { useEffect, useRef } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { getSocket } from '../services/socketClient';
import { useTripStore } from '../store/tripStore';
import { TripStatus } from '../types';
import { CONFIG } from '../services/config';

export function useLocationStream() {
    const watchId = useRef<number | null>(null);
    const tripStatus = useTripStore((s) => s.tripStatus);
    const currentTrip = useTripStore((s) => s.currentTrip);

    useEffect(() => {
        const isActive = tripStatus !== TripStatus.OFFLINE;

        if (isActive) {
            watchId.current = Geolocation.watchPosition(
                (position) => {
                    const socket = getSocket();
                    if (!socket?.connected) return;

                    socket.emit('driver:update_location', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        trip_id: currentTrip?.id || undefined,
                    });
                },
                (error) => console.error('[Location] Error:', error),
                {
                    enableHighAccuracy: true,
                    distanceFilter: 10,           // Chỉ emit khi di chuyển >10m
                    interval: CONFIG.LOCATION_INTERVAL_MS,
                    fastestInterval: 3000,
                },
            );
        }

        return () => {
            if (watchId.current !== null) {
                Geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, [tripStatus, currentTrip?.id]);
}
```

---

### [MODIFY] `HomeScreen.tsx`

| Vùng code | Thay đổi |
|-----------|----------|
| Import | Thêm `useLocationStream` |
| Component body | Gọi `useLocationStream()` |
| Mock booking timer | **XÓA** `setTimeout` 5s mock → Socket xử lý qua `tripStore` |
| Error handling | Thêm try/catch wrapper cho các tripStore actions |

```diff
+import { useLocationStream } from '../hooks/useLocationStream';

 const HomeScreen = () => {
+    useLocationStream();

     // XÓA toàn bộ block:
-    useEffect(() => {
-        if (tripStatus === TripStatus.ONLINE) {
-            const timer = setTimeout(() => receiveBooking(), 5000);
-            return () => clearTimeout(timer);
-        }
-    }, [tripStatus]);
```

---

### [MODIFY] `TripBottomSheet.tsx`

> [!TIP]
> **Review fix #1 impact:** Không cần thay đổi callback nào!
> Mọi action đều `zero-argument` nên UI gọi y hệt code cũ: `acceptTrip()`, `confirmArrived()`, `cancelTrip()`.

Thay đổi duy nhất: `submitRating()` gọi API thay vì `console.log`.

```diff
 // Accept button — KHÔNG thay đổi
 onPress={() => acceptTrip()}   // tripId tự lấy từ store bên trong

 // Arrived button — KHÔNG thay đổi
 onPress={() => confirmArrived()}

 // Finish button → submitRating gọi API
-console.log('[TripStore] Customer Rating Submitted:', ...)
+// Đã xử lý trong tripStore.submitRating() → gọi POST /rides/:id/rate
```

---

## Verification

### Manual Test (Full Trip Flow)

**Chuẩn bị:** BE chạy + PostgreSQL + Redis sẵn sàng.

1. **Driver toggle Online:**
   - ✅ `PATCH /drivers/availability` → response 200
   - ✅ Socket connected (xem BE console: "Client connected")
   - ✅ GPS emit mỗi 5s (xem Redis: `driver_locations` có data)

2. **Tạo cuốc test:** Mở Swagger `POST /rides` với body customer giả:
   ```json
   {
     "pickup_latitude": 21.028,
     "pickup_longitude": 105.804,
     "dropoff_latitude": 21.037,
     "dropoff_longitude": 105.815,
     "vehicle_type": "MOTORCYCLE"
   }
   ```
   - ✅ Driver app nhận `server:ride_request` → BookingModal hiện
   - ✅ Trạng thái = BOOKING_INCOMING

3. **Accept → Arrived → Start → Finish → Rate:**
   - ✅ Mỗi bước gọi API → response 200
   - ✅ UI chuyển đúng trạng thái (mapping hoạt động)
   - ✅ Rating gửi về BE → `GET /rides/:id` có rating data

4. **Edge cases:**
   - ❌ Mất mạng giữa chừng → API fail → state KHÔNG thay đổi
   - ❌ Socket disconnect → auto-reconnect sau 3s
   - ✅ **Reconnect sync (Review fix #2):** Tài xế mất mạng → khách huỷ → tài xế có mạng lại → Socket reconnect → app tự gọi `GET /rides/:id` → phát hiện CANCELLED → cập nhật UI về CANCELED → không bị kẹt

---

## Deliverables

| File | Action | LOC |
|------|--------|-----|
| `driver-app/src/store/tripStore.ts` | MAJOR REWRITE | ~200 (from 170) |
| `driver-app/src/hooks/useLocationStream.ts` | NEW | ~50 |
| `driver-app/src/screens/HomeScreen.tsx` | MODIFY | ~20 lines changed/removed |
| `driver-app/src/components/TripBottomSheet.tsx` | MODIFY | ~10 lines changed |

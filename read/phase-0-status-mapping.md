# Phase 0: Đồng Bộ TripStatus — Mapping Layer

> **Ưu tiên: CỰC CAO** — Phải hoàn thành trước mọi phase khác.
> Nếu FE và BE không "nói chung ngôn ngữ" thì mọi API call về sau đều gãy luồng.

---

## Vấn Đề

FE và BE đang dùng **2 hệ thống trạng thái khác nhau hoàn toàn:**

| # | FE (`driver-app/src/types`) | BE (`backend/src/common/enums`) | Ghi chú |
|---|---------------------------|-------------------------------|---------|
| 1 | `OFFLINE` | *(không có)* | Chỉ UI — tài xế tắt app/offline |
| 2 | `ONLINE` | *(không có)* | Chỉ UI — tài xế bật sẵn sàng |
| 3 | `BOOKING_INCOMING` | `PENDING` | Cuốc mới đổ về |
| 4 | `BOOKING_TIMEOUT` | *(không có)* | Chỉ UI — hết giờ nhận cuốc |
| 5 | `ARRIVING` | `ACCEPTED` | Tài xế chấp nhận, đang tới |
| 6 | `ARRIVED` | `ARRIVED` | ✅ Khớp |
| 7 | `WAITING` | *(không có)* | Chỉ UI — đợi khách lên xe |
| 8 | `SERVING` | `IN_PROGRESS` | Đang chạy |
| 9 | `FINISHED` | `COMPLETED` | Hoàn thành |
| 10 | `CANCELED` | `CANCELLED_BY_CUSTOMER` | BE phân loại ai huỷ |
| 10 | `CANCELED` | `CANCELLED_BY_DRIVER` | BE phân loại ai huỷ |

**Quy luật:**
- FE có **4 trạng thái chỉ tồn tại ở UI** (OFFLINE, ONLINE, BOOKING_TIMEOUT, WAITING) — BE KHÔNG biết và KHÔNG cần biết.
- BE có **2 loại cancel** mà FE gộp thành 1.
- Chỉ **1 trạng thái khớp tên** (ARRIVED).

---

## Giải Pháp: Tạo Mapping Adapter

### Chiến lược: FE giữ nguyên enum, tạo adapter convert 2 chiều

**Tại sao không sửa BE hay FE cho khớp nhau?**
- Sửa BE → phá Swagger docs, phá customer-app, phá integration khác.
- Sửa FE → phải đổi 50+ references trong 4 files, rủi ro regression cao.
- **Adapter pattern** = 0 thay đổi ở cả 2 bên existing code, chỉ thêm 1 file mới.

---

### File cần tạo

#### [NEW] `tripStatusMapper.ts` — `driver-app/src/utils/tripStatusMapper.ts`

```typescript
import { TripStatus } from '../types';

/**
 * Backend TripStatus values (as received from API/Socket)
 * Đây là "ngôn ngữ" của server.
 */
export type BackendTripStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED_BY_CUSTOMER'
  | 'CANCELLED_BY_DRIVER';

/**
 * BE → FE: Convert trạng thái từ server về trạng thái UI.
 * Dùng khi: nhận response từ API hoặc Socket event.
 */
export function toFrontendStatus(beStatus: BackendTripStatus): TripStatus {
  const map: Record<BackendTripStatus, TripStatus> = {
    PENDING:              TripStatus.BOOKING_INCOMING,
    ACCEPTED:             TripStatus.ARRIVING,
    ARRIVED:              TripStatus.ARRIVED,
    IN_PROGRESS:          TripStatus.SERVING,
    COMPLETED:            TripStatus.FINISHED,
    CANCELLED_BY_CUSTOMER: TripStatus.CANCELED,
    CANCELLED_BY_DRIVER:  TripStatus.CANCELED,
  };
  return map[beStatus] ?? TripStatus.OFFLINE;
}

/**
 * FE → BE: Convert trạng thái UI về trạng thái server.
 * Dùng khi: gọi API PATCH /trips/:id/status
 *
 * Chỉ map những trạng thái CÓ TƯƠNG ĐƯƠNG ở BE.
 * OFFLINE, ONLINE, BOOKING_TIMEOUT, WAITING → không gửi lên BE.
 */
export function toBackendStatus(feStatus: TripStatus): BackendTripStatus | null {
  const map: Partial<Record<TripStatus, BackendTripStatus>> = {
    [TripStatus.BOOKING_INCOMING]: 'PENDING',
    [TripStatus.ARRIVING]:         'ACCEPTED',
    [TripStatus.ARRIVED]:          'ARRIVED',
    [TripStatus.SERVING]:          'IN_PROGRESS',
    [TripStatus.FINISHED]:         'COMPLETED',
    [TripStatus.CANCELED]:         'CANCELLED_BY_DRIVER', // Driver app → cancel = by driver
  };
  return map[feStatus] ?? null; // null = trạng thái chỉ FE, không gửi BE
}

/**
 * Kiểm tra trạng thái này có phải UI-only (không tồn tại ở BE) không.
 */
export function isUIOnlyStatus(status: TripStatus): boolean {
  return [
    TripStatus.OFFLINE,
    TripStatus.ONLINE,
    TripStatus.BOOKING_TIMEOUT,
    TripStatus.WAITING,
  ].includes(status);
}
```

---

### Nơi sử dụng (Phase sau)

| File | Hàm/Logic | Mapper dùng |
|------|-----------|-------------|
| `tripStore.ts` | `receiveBooking()` — nhận Socket event | `toFrontendStatus()` |
| `tripStore.ts` | `acceptTrip()` — gọi API accept | `toBackendStatus()` |
| `tripStore.ts` | `confirmArrived()` — gọi API status | `toBackendStatus()` |
| `tripStore.ts` | `startTrip()` — gọi API status | `toBackendStatus()` |
| `tripStore.ts` | `finishTrip()` — gọi API status | `toBackendStatus()` |
| `tripStore.ts` | `cancelTrip()` — gọi API cancel | `toBackendStatus()` |
| `tripStore.ts` | Socket `server:trip_status_changed` | `toFrontendStatus()` |
| Mọi API response có field `status` | Parse response | `toFrontendStatus()` |

---

### Sơ đồ luồng

```
┌──────────────┐     toBackendStatus()      ┌──────────────┐
│   DRIVER APP │  ─────────────────────────► │   BACKEND    │
│   (FE enum)  │                             │   (BE enum)  │
│              │  ◄───────────────────────── │              │
└──────────────┘     toFrontendStatus()      └──────────────┘

FE-only states (không gửi BE):
  OFFLINE, ONLINE, BOOKING_TIMEOUT, WAITING

BE-only detail (FE gộp lại):
  CANCELLED_BY_CUSTOMER ──┐
  CANCELLED_BY_DRIVER  ───┴──► CANCELED
```

---

## Verification

1. **Unit test `tripStatusMapper.ts`:**
   - `toFrontendStatus('PENDING')` → `TripStatus.BOOKING_INCOMING`
   - `toFrontendStatus('COMPLETED')` → `TripStatus.FINISHED`
   - `toBackendStatus(TripStatus.SERVING)` → `'IN_PROGRESS'`
   - `toBackendStatus(TripStatus.ONLINE)` → `null`
   - `isUIOnlyStatus(TripStatus.WAITING)` → `true`
   - `isUIOnlyStatus(TripStatus.ARRIVING)` → `false`

2. **Không có regression:** File mới, không sửa file cũ → 0% risk break existing UI.

---

## Deliverables

| File | Action | LOC ước tính |
|------|--------|-------------|
| `driver-app/src/utils/tripStatusMapper.ts` | NEW | ~65 |
| `driver-app/src/utils/__tests__/tripStatusMapper.test.ts` | NEW (optional) | ~40 |

> **Thời gian ước tính:** 30 phút (code + test)

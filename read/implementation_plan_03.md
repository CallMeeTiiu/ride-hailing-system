# Kế Hoạch Nối Frontend (Driver App) ↔ Backend

> **Mục tiêu:** Kết nối driver-app (React Native) với backend (NestJS) — thay mock data bằng API + Socket.IO thực tế.

---

## 📂 Cấu Trúc Folder Hiện Tại

### Backend (`backend/src/`)
```
backend/src/
├── main.ts                          # Bootstrap + Swagger
├── app.module.ts                    # Root module (TypeORM + Postgres + all imports)
├── app.controller.ts / .service.ts  # Hello World root
│
├── common/enums/index.ts            # UserRole, TripStatus, VehicleType, PaymentMethod
│
├── auth/                            # 🔐 Authentication module
│   ├── auth.controller.ts           # 8 endpoints (customer+driver login/register/OTP)
│   ├── auth.service.ts              # JWT tokens + bcrypt + OTP mock
│   ├── auth.module.ts
│   ├── strategies/jwt.strategy.ts   # Passport JWT guard
│   ├── entities/refresh-token.entity.ts
│   └── dto/ (5 files)              # LoginDto, VerifyOtpDto, AuthResponseDto, ...
│
├── users/                           # 👤 User management
│   ├── users.service.ts             # findByPhone, save, updateLastLogin
│   ├── users.module.ts
│   ├── addresses.controller.ts      # Saved addresses CRUD
│   ├── addresses.service.ts
│   ├── devices.controller.ts        # Device token management
│   └── entities/                    # User, CustomerProfile, SavedPlace
│
├── drivers/                         # 🚗 Driver module
│   ├── drivers.controller.ts        # 12 endpoints (profile, vehicle, document, wallet, offers, history)
│   ├── drivers.service.ts           # CRUD + wallet mock + trip history
│   ├── drivers.module.ts
│   ├── entities/                    # DriverProfile, Vehicle, DriverDocument
│   └── dto/ (9 files)              # Profile, Vehicle, Document, Status, Availability DTOs
│
├── rides/                           # 🛣️ Trip/Ride module
│   ├── rides.controller.ts          # 7 endpoints (quote, create, accept, cancel, status, rate, history)
│   ├── rides.service.ts             # createTrip, updateStatus, saveRating + auto-pricing
│   ├── rides.module.ts
│   ├── trip.gateway.ts              # 🔌 Socket.IO WebSocket Gateway
│   ├── entities/                    # Trip, TripLocation, Rating
│   └── dto/ (3 files)              # CreateQuoteDto, CreateRideDto, TripResponseDto
│
├── location/                        # 📍 Redis GEO location
│   ├── location.service.ts          # updateDriverLocation, findNearbyDrivers, setAvailability
│   └── location.module.ts
│
├── payments/                        # 💳 Payments
│   ├── payments.controller.ts
│   ├── payments.service.ts
│   ├── payments.module.ts
│   └── entities/payment.entity.ts
│
├── redis/                           # Red ioredis wrapper
│   ├── redis.service.ts
│   └── redis.module.ts
│
├── firebase/                        # 🔔 Firebase push notifications
│   ├── notification.service.ts
│   └── firebase.module.ts
│
├── google/                          # 💰 Pricing/fare calculation
│   ├── pricing.service.ts
│   └── google.module.ts
│
├── uploads/
│   └── uploads.controller.ts        # File upload endpoint
│
└── customers/
    ├── customers.controller.ts
    └── customers.service.ts
```

### Driver App (`driver-app/src/`)
```
driver-app/src/
├── components/                      # 🧩 11 UI components
│   ├── BookingModal.tsx             # Countdown + Accept/Reject
│   ├── CanceledModal.tsx            # Cancel alert
│   ├── CustomerInfo.tsx             # Avatar + name + rating
│   ├── EmojiGrid.tsx                # 10-emoji rating
│   ├── LocationRow.tsx              # Pickup/Dropoff display
│   ├── MapBackground.tsx            # Leaflet WebView map
│   ├── PrimaryButton.tsx            # 4 variants
│   ├── StarRating.tsx               # 5-star interactive
│   ├── StatusToggle.tsx             # Online/Offline pill
│   ├── StepIndicator.tsx            # 3-step progress
│   └── TripBottomSheet.tsx          # Multi-state bottom sheet (486 LOC)
│
├── screens/                         # 📱 5 screens
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx               # Map + overlays
│   ├── ChatScreen.tsx               # Messaging UI
│   ├── CallScreen.tsx               # VoIP-style UI
│   └── ProfileScreen.tsx            # Driver profile
│
├── store/                           # 🗄️ Zustand stores
│   ├── authStore.ts                 # ❌ Mock login (hardcoded token)
│   └── tripStore.ts                 # ❌ Mock trip lifecycle (MOCK_TRIP)
│
├── navigation/                      # 🧭 4-layer navigation
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   ├── MainTab.tsx
│   └── HomeStack.tsx
│
├── data/
│   └── mockData.ts                  # Mock driver, trip, chat data
│
├── hooks/
│   └── useLocationPermission.ts     # Location permission hook
│
├── theme/
│   └── index.ts                     # Design system tokens
│
├── types/
│   ├── index.ts                     # TripStatus, DriverProfile, TripData, etc.
│   └── navigation.ts               # Navigation type params
│
└── utils/
    ├── fetchRoute.ts                # OSRM route fetching
    └── formatPhone.ts               # +84 phone formatting
```

---

## 🔍 Gap Analysis: FE vs BE

| Tính năng | Backend (BE) | Driver App (FE) | Gap |
|-----------|-------------|-----------------|-----|
| **Login** | ✅ `POST /auth/driver/login` → JWT | ❌ Mock `setTimeout` + hardcoded token | API client cần tạo |
| **Register** | ✅ `POST /auth/driver/register` | ❌ Chưa có UI | Thêm RegisterScreen |
| **Online/Offline** | ✅ `PATCH /drivers/availability` | ❌ Local state only | Gọi API khi toggle |
| **Receive Booking** | ✅ Socket `server:ride_request` | ❌ Mock `setTimeout` 5s | Socket.IO listener |
| **Accept Trip** | ✅ `POST /rides/:id/accept` | ❌ Local state only | Gọi API khi accept |
| **Reject/Timeout** | ✅ Socket `server:offer_expired` | ❌ Local state only | Socket listener |
| **Update Status** | ✅ `PATCH /trips/:id/status` | ❌ Local state only | Gọi API mỗi bước |
| **Location Stream** | ✅ Socket `driver:update_location` | ❌ Chưa emit | Emit GPS mỗi 5s |
| **Rating** | ✅ `POST /rides/:id/rate` | ❌ `console.log` only | Gọi API submit |
| **Profile** | ✅ `GET/PUT /drivers/me` | ❌ Mock MOCK_DRIVER | Fetch profile từ API |
| **Trip History** | ✅ `GET /drivers/trips/history` | ❌ Chưa có UI | Thêm screen |
| **Wallet** | ✅ `GET /drivers/wallet` | ❌ Chưa có UI | Thêm screen |
| **Chat** | ❌ Chưa có BE | ✅ Mock auto-reply UI | BE chat module cần tạo |
| **Call** | ❌ Chưa có BE | ✅ Mock timer UI | Chỉ UI demo |

---

## 📋 Proposed Changes (Ưu tiên cho Driver App ↔ Backend)

### Phase 1: Foundation — API Client + Auth (Ngày 1-2)

#### [NEW] `apiClient.ts` — [driver-app/src/services/apiClient.ts](file:///d:/ride-hailing-system/driver-app/src/services/apiClient.ts)
- Tạo Axios instance với `baseURL` từ config
- Interceptor tự động gắn `Authorization: Bearer <token>` từ store
- Interceptor xử lý 401 → auto-logout
- Token storage dùng `@react-native-async-storage/async-storage`

#### [NEW] `socketClient.ts` — [driver-app/src/services/socketClient.ts](file:///d:/ride-hailing-system/driver-app/src/services/socketClient.ts)
- Socket.IO client connect khi online, disconnect khi offline
- Auth bằng JWT token trong `handshake.auth.token`
- Event listeners: `server:ride_request`, `server:trip_status_changed`, `server:offer_expired`, `server:trip_cancelled`

#### [NEW] `config.ts` — [driver-app/src/services/config.ts](file:///d:/ride-hailing-system/driver-app/src/services/config.ts)
- `API_BASE_URL` (default: `http://10.0.2.2:3000` cho Android emulator)
- `SOCKET_URL` (same host)
- `LOCATION_INTERVAL_MS` = 5000

#### [MODIFY] `authStore.ts` — [authStore.ts](file:///d:/ride-hailing-system/driver-app/src/store/authStore.ts)
- `login()`: Gọi `POST /auth/driver/login` → lưu token + user info
- `logout()`: Xoá token khỏi AsyncStorage
- `loadToken()`: Khôi phục session khi mở app
- `fetchProfile()`: Gọi `GET /drivers/me` → cập nhật driver profile

---

### Phase 2: Trip Lifecycle — REST + Socket (Ngày 3-5)

#### [MODIFY] `tripStore.ts` — [tripStore.ts](file:///d:/ride-hailing-system/driver-app/src/store/tripStore.ts)
- `toggleOnline()`: Gọi `PATCH /drivers/availability` + connect/disconnect Socket
- `acceptTrip()`: Gọi `POST /rides/:id/accept` → chờ response → cập nhật state
- `confirmArrived()`: Gọi `PATCH /trips/:id/status` body `{ status: "ARRIVED" }`
- `startTrip()`: Gọi `PATCH /trips/:id/status` body `{ status: "IN_PROGRESS" }`
- `finishTrip()`: Gọi `PATCH /trips/:id/status` body `{ status: "COMPLETED" }`
- `submitRating()`: Gọi `POST /rides/:id/rate` body `{ rating, comment }`
- `receiveBooking()`: Thay `setTimeout` bằng Socket listener `server:ride_request`

#### [NEW] `useLocationStream.ts` — [driver-app/src/hooks/useLocationStream.ts](file:///d:/ride-hailing-system/driver-app/src/hooks/useLocationStream.ts)
- Dùng `react-native-geolocation-service` lấy GPS mỗi 5s
- Emit `driver:update_location` qua Socket khi driver đang online
- Gửi kèm `trip_id` nếu đang trong trip active

#### [MODIFY] `HomeScreen.tsx` — [HomeScreen.tsx](file:///d:/ride-hailing-system/driver-app/src/screens/HomeScreen.tsx)
- Gắn `useLocationStream` hook
- Thay mock booking timer bằng Socket event handler
- Loading/error states cho API calls

---

### Phase 3: Profile + Polish (Ngày 6-7)

#### [MODIFY] `ProfileScreen.tsx` — [ProfileScreen.tsx](file:///d:/ride-hailing-system/driver-app/src/screens/ProfileScreen.tsx)
- Fetch driver profile từ API `GET /drivers/me`
- Hiển thị data thực thay vì MOCK_DRIVER
- Sign out → clear AsyncStorage + navigate to AuthStack

#### [MODIFY] `LoginScreen.tsx` — [LoginScreen.tsx](file:///d:/ride-hailing-system/driver-app/src/screens/LoginScreen.tsx)
- Gọi `authStore.login()` thực (API call)
- Hiển thị server-side error messages
- Thêm nút "Đăng ký" → navigate tới RegisterScreen (nếu có)

---

## ⚠️ User Review Required

> [!IMPORTANT]
> **TripStatus mismatch** giữa FE và BE cần được resolve:
> - **FE** dùng: `OFFLINE`, `ONLINE`, `BOOKING_INCOMING`, `BOOKING_TIMEOUT`, `ARRIVING`, `ARRIVED`, `WAITING`, `SERVING`, `FINISHED`, `CANCELED`
> - **BE** dùng: `PENDING`, `ACCEPTED`, `ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED_BY_CUSTOMER`, `CANCELLED_BY_DRIVER`
> 
> → Cần tạo **mapping layer** trong FE để convert BE status ↔ FE status (VD: `PENDING` → `BOOKING_INCOMING`, `ACCEPTED` → `ARRIVING`, `IN_PROGRESS` → `SERVING`, `COMPLETED` → `FINISHED`)

> [!WARNING]
> **BE chưa có Chat module.** ChatScreen hiện tại chỉ là mock UI. Nếu muốn chat real-time, cần thêm module Chat vào backend (ngoài scope plan này). Tạm thời giữ mock cho chat.

---

## 📦 Dependencies Cần Cài (driver-app)

```bash
npm install axios socket.io-client @react-native-async-storage/async-storage
```

---

## Verification Plan

### Automated Tests

Hiện tại cả 2 bên đều chưa có test đáng kể:
- BE: Có `app.controller.spec.ts` (basic) + Jest config → có thể thêm unit test cho auth/rides service
- FE: Có Jest config nhưng chỉ có `__tests__/App.test.tsx` mặc định

> [!NOTE]
> Đề xuất thêm test sau khi implement:
> 1. **BE integration test**: `POST /auth/driver/login` → verify JWT response (chạy bằng `cd backend && npm test`)
> 2. **FE unit test**: `authStore` login/logout actions (chạy bằng `cd driver-app && npm test`)

### Manual Verification
1. **Auth flow**: Mở app → Login bằng phone+password → Verify token lưu vào store → Profile screen hiển thị data thực
2. **Trip flow**: Toggle Online → Nhận cuốc từ backend (tạo trip qua Swagger `/api/docs`) → Accept → Arrived → Start → Finish → Rate
3. **Socket**: Kiểm tra driver location emit liên tục khi online (xem log backend console)

> Cần user confirm: **Bạn có sẵn database PostgreSQL + Redis chạy local không?** Nếu chưa, cần thêm bước setup Docker compose.

---

## 📈 Tiến Độ Cập Nhật (2026-05-30)

| Module | Trước (28/05) | Hiện tại (30/05) | Sau implement |
|--------|---------------|------------------|---------------|
| Backend | ~5% | **~55%** (12 modules, API+Socket+Auth đầy đủ) | ~65% |
| Driver App UI | ~65% | **~65%** (không đổi) | ~65% |
| Driver App Integration | 0% | **0%** | **~70%** |
| **Tổng dự án** | ~35% | **~40%** | **~55%** |

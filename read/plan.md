# 📋 Kế Hoạch Phát Triển Frontend — Driver App

> **Ngày tạo:** 2026-05-20
> **Phân hệ:** `driver-app` (React Native 0.84.1 — Bare Workflow)
> **Platform:** Android (ưu tiên) + iOS
> **Trạng thái:** 📝 PLANNING

---

## 1. Trích Xuất Design System (Visual Analysis)

### 1.1. Bảng Màu (Color Palette)

| Token | Hex | Mô tả | Dùng cho |
|-------|-----|--------|----------|
| `primary` | `#F5A623` | Amber/Golden Yellow | Nút CTA (Sign in, Accept), icon active, toggle Online, thanh tiến trình |
| `primaryDark` | `#E09500` | Amber đậm | Nút pressed state, border active |
| `primaryLight` | `#FFF3D6` | Vàng nhạt | Halo xung quanh avatar driver trên bản đồ |
| `background` | `#FFFFFF` | White | Bottom Sheet, Card, Modal |
| `surface` | `#F9F9F9` | Off-white | Input fields background |
| `mapTint` | `#F5E6C8` | Beige/Sand | Map overlay tint (warm tone) |
| `textPrimary` | `#1A1A1A` | Near-black | Heading, tên khách |
| `textSecondary` | `#8E8E93` | Gray | Label, subtitle, placeholder |
| `textTertiary` | `#BDBDBD` | Light gray | Inactive step label |
| `success` | `#4CAF50` | Green | Rating star, Online text |
| `error` | `#F44336` | Red | Reject button text |
| `white` | `#FFFFFF` | White | Text trên nút primary |
| `overlay` | `rgba(0,0,0,0.5)` | Black 50% | Modal backdrop |

### 1.2. Typography

| Level | Size | Weight | Dùng cho |
|-------|------|--------|----------|
| `h1` | 28px | Bold (700) | "Hello Driver!" |
| `h2` | 22px | SemiBold (600) | Tên khách trên Bottom Sheet |
| `h3` | 18px | SemiBold (600) | "There is a customer booking!" |
| `body` | 16px | Regular (400) | Text chính, địa chỉ |
| `caption` | 14px | Regular (400) | Label (PICKUP, DROP-OFF), số ĐT |
| `small` | 12px | Medium (500) | Step label (ARRIVING, WAITING, FINISHING) |

**Font family:** System default — San Francisco (iOS) / Roboto (Android).

### 1.3. Spacing & Radius

| Token | Value |
|-------|-------|
| `spacingXS` | 4px |
| `spacingSM` | 8px |
| `spacingMD` | 16px |
| `spacingLG` | 24px |
| `spacingXL` | 32px |
| `radiusSM` | 8px |
| `radiusMD` | 12px |
| `radiusLG` | 16px |
| `radiusFull` | 999px (pill shape cho nút Sign in) |
| `iconSize` | 24px |
| `avatarSM` | 40px |
| `avatarMD` | 56px |
| `avatarLG` | 80px |
| `touchTarget` | 48px (minimum) |

---

## 2. Cấu Trúc Navigation (React Navigation)

### 2.1. Navigation Tree

```
RootNavigator (NavigationContainer)
│
├── AuthStack (Stack.Navigator)
│   └── LoginScreen
│
└── MainTab (Bottom Tab Navigator)
    ├── HomeStack (Stack.Navigator)
    │   ├── HomeScreen          ← Chứa state machine (Offline → ... → Finish)
    │   ├── ChatScreen          ← Modal push khi ấn icon chat
    │   └── CallScreen          ← Modal push khi ấn icon call
    │
    └── ProfileScreen           ← Tab "Profile" (placeholder)
```

### 2.2. Luồng Auth

```
App Start
  │
  ├── Có token hợp lệ → MainTab (HomeScreen — Offline)
  │
  └── Không có token → AuthStack (LoginScreen)
       │
       └── Login thành công → navigate('MainTab')
```

### 2.3. Thư viện Navigation

```
@react-navigation/native
@react-navigation/native-stack
@react-navigation/bottom-tabs
react-native-screens
```

---

## 3. State Machine & Component Architecture

### 3.1. Trip State Machine

```typescript
enum TripStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  BOOKING_INCOMING = 'BOOKING_INCOMING',
  BOOKING_TIMEOUT = 'BOOKING_TIMEOUT',  // Hết thời gian nhận cuốc
  ARRIVING = 'ARRIVING',
  ARRIVED = 'ARRIVED',        // Confirm Arrived
  WAITING = 'WAITING',        // Chờ khách lên xe
  SERVING = 'SERVING',        // Đang chở khách
  FINISHED = 'FINISHED',      // Hoàn thành
  CANCELED = 'CANCELED',      // Khách huỷ cuốc
}
```

**Sơ đồ chuyển trạng thái:**

```
OFFLINE ──(toggle on)──→ ONLINE
ONLINE ──(toggle off)──→ OFFLINE
ONLINE ──(5s mock delay)──→ BOOKING_INCOMING

BOOKING_INCOMING ──(Reject)──→ ONLINE
BOOKING_INCOMING ──(Accept)──→ ARRIVING
BOOKING_INCOMING ──(15s timeout)──→ ONLINE      ← Cuốc xe tự trôi

ARRIVING ──(Confirm arrived)──→ ARRIVED → WAITING
ARRIVING ──(Khách huỷ)──→ CANCELED
WAITING ──(Khách huỷ)──→ CANCELED
WAITING ──(Start)──→ SERVING
SERVING ──(Finish!)──→ FINISHED

CANCELED ──(OK/dismiss)──→ ONLINE               ← Modal "Chuyến đi đã bị huỷ"
FINISHED ──(auto/tap)──→ ONLINE
```

**Edge Cases:**
- **Booking Timeout:** `BookingModal` có thanh progress bar chạy lùi 15 giây. Hết thời gian → tự dismiss → quay về `ONLINE`.
- **Khách huỷ cuốc:** Ở trạng thái `ARRIVING` hoặc `WAITING`, mock một nút "Simulate Cancel" (dev-only). Khi trigger → hiện Modal "Chuyến đi đã bị huỷ bởi khách hàng" + nút OK → quay về `ONLINE`.
- **Hủy không được ở `SERVING`:** Khi đang chở khách thì không thể huỷ (logic thực tế).

### 3.2. State Management: Zustand

Chọn **Zustand** vì:
- App đơn giản, ít shared state
- Không cần boilerplate nặng như Redux
- Dễ integrate với React Navigation
- TypeScript native support

**Stores cần tạo:**

| Store | Chứa | File |
|-------|------|------|
| `useAuthStore` | `isLoggedIn`, `token`, `driver` | `src/store/authStore.ts` |
| `useTripStore` | `tripStatus`, `currentTrip`, actions | `src/store/tripStore.ts` |

### 3.3. Folder Structure

```
driver-app/
├── src/
│   ├── components/           # Shared/reusable components
│   │   ├── PrimaryButton.tsx
│   │   ├── IconButton.tsx
│   │   ├── Avatar.tsx
│   │   ├── StatusToggle.tsx          # Online/Offline toggle pill
│   │   ├── StepIndicator.tsx         # Arriving → Waiting → Finishing bar
│   │   ├── BookingModal.tsx          # Modal khi có cuốc xe mới (+ countdown bar)
│   │   ├── CanceledModal.tsx         # Modal "Chuyến đi đã bị huỷ"
│   │   ├── TripBottomSheet.tsx       # Bottom sheet trip info
│   │   ├── CustomerInfo.tsx          # Row: avatar + name + phone + rating
│   │   ├── LocationRow.tsx           # Icon + label + address
│   │   ├── PhoneInput.tsx            # Input auto-format +84 123 456 789
│   │   └── MapMarker.tsx             # Custom driver marker trên bản đồ
│   │
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   ├── CallScreen.tsx
│   │   └── ProfileScreen.tsx         # Placeholder
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx
│   │   ├── AuthStack.tsx
│   │   ├── MainTab.tsx
│   │   └── HomeStack.tsx
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── tripStore.ts
│   │
│   ├── types/
│   │   └── index.ts                  # Interfaces & Enums
│   │
│   ├── data/
│   │   └── mockData.ts               # Mock trip, chat, driver data
│   │
│   ├── theme/
│   │   └── index.ts                  # Colors, typography, spacing tokens
│   │
│   └── utils/
│       ├── helpers.ts
│       └── formatPhone.ts           # Format số ĐT: +84123456789 → +84 123 456 789
│
├── App.tsx                           # Entry point → RootNavigator
└── ...config files
```

### 3.4. Reusable Components

| Component | Props chính | Dùng ở |
|-----------|-------------|--------|
| `PrimaryButton` | `title`, `onPress`, `variant` | Login, Accept, Confirm, Start, Finish |
| `IconButton` | `icon`, `onPress`, `size`, `color` | Call, Chat, My Location, Back |
| `Avatar` | `uri`, `size`, `badge?` | Driver trên map, Customer info |
| `StatusToggle` | `isOnline`, `onToggle` | Top của HomeScreen |
| `StepIndicator` | `currentStep: number`, `steps: string[]` | Bottom Sheet khi đang trip |
| `BookingModal` | `trip`, `onAccept`, `onReject`, `visible`, `timeoutSeconds` | Overlay trên HomeScreen (có countdown bar) |
| `CanceledModal` | `visible`, `onDismiss` | Overlay khi khách huỷ cuốc |
| `TripBottomSheet` | `tripStatus`, `trip`, actions | Bottom half HomeScreen |
| `CustomerInfo` | `customer`, `onCall`, `onChat` | Trong TripBottomSheet |
| `LocationRow` | `type: 'pickup'|'dropoff'`, `address` | Trong BookingModal |
| `PhoneInput` | `value`, `onChangeText`, `placeholder` | LoginScreen (auto-format) |
| `MapMarker` | `coordinate`, `type` | Trên MapView |

---

## 4. Mock Data & TypeScript Interfaces

### 4.1. Interfaces (`src/types/index.ts`)

```typescript
// Enum: Trip state machine
export enum TripStatus {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
  BOOKING_INCOMING = 'BOOKING_INCOMING',
  BOOKING_TIMEOUT = 'BOOKING_TIMEOUT',
  ARRIVING = 'ARRIVING',
  ARRIVED = 'ARRIVED',
  WAITING = 'WAITING',
  SERVING = 'SERVING',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
}

// Driver profile
export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  rating: number;
  vehiclePlate: string;
}

// Customer trong cuốc xe
export interface Customer {
  id: string;
  name: string;
  phone: string;
  avatarUrl: string;
  rating: number;
}

// Dữ liệu cuốc xe
export interface TripData {
  id: string;
  customer: Customer;
  pickup: LocationPoint;
  dropoff: LocationPoint;
  fare?: number;
  status: TripStatus;
  createdAt: string;
}

export interface LocationPoint {
  address: string;
  latitude: number;
  longitude: number;
}

// Chat
export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  imageUrl?: string;
  timestamp: string;
  isDriver: boolean;
}
```

### 4.2. Mock Data (`src/data/mockData.ts`)

Dữ liệu mẫu bao gồm:
- **Mock Driver** — Tài xế đã đăng nhập
- **Mock Trip** — Cuốc xe John Doe, 123 Sunshine Street → 456 Moonlight Avenue
- **Mock Chat Messages** — 5-6 tin nhắn mẫu giữa driver và customer
- **Mock Coordinates** — Tọa độ giả cho pickup/dropoff/driver

---

## 5. Dependencies (Thư Viện Cần Cài)

### 5.1. Bắt buộc

| Package | Version | Mục đích |
|---------|---------|----------|
| `@react-navigation/native` | ^7.x | Core navigation |
| `@react-navigation/native-stack` | ^7.x | Stack navigator |
| `@react-navigation/bottom-tabs` | ^7.x | Tab bar (Home + Profile) |
| `react-native-screens` | ^4.x | Native screen containers |
| `react-native-maps` | ^2.x | Bản đồ Google/Apple Maps |
| `@gorhom/bottom-sheet` | ^5.x | Bottom Sheet (trip info panel) |
| `react-native-reanimated` | ^3.x | Animations (required by bottom-sheet) |
| `react-native-gesture-handler` | ^2.x | Gesture support |
| `react-native-vector-icons` | ^10.x | Icon set (Feather/MaterialIcons) |
| `react-native-permissions` | ^5.x | Xin quyền vị trí (location, camera...) |
| `zustand` | ^5.x | State management |
| `react-native-safe-area-context` | ^5.x | ✅ Đã cài |

### 5.2. Tùy chọn (Phase sau)

| Package | Mục đích |
|---------|----------|
| `react-native-keychain` | Lưu token an toàn (thay AsyncStorage) |
| `react-native-image-picker` | Gửi ảnh trong chat |
| `@react-native-async-storage/async-storage` | Lưu preferences |

### 5.3. Cấu Hình Thư Viện "Khó Tính" (⚠️ Quan Trọng)

#### Google Maps API Key
`react-native-maps` cần API Key để render bản đồ (không có → màn hình trống):
- **Android:** Thêm key vào `android/app/src/main/AndroidManifest.xml`
  ```xml
  <meta-data
    android:name="com.google.android.geo.API_KEY"
    android:value="YOUR_GOOGLE_MAPS_API_KEY"/>
  ```
- **iOS:** Thêm vào `AppDelegate.mm` (Phase sau)
- Key lưu qua biến môi trường hoặc file riêng, **không commit** vào git.

#### react-native-reanimated + gesture-handler
Hai thư viện này yêu cầu config đặc biệt:
1. **`babel.config.js`:** Thêm plugin `react-native-reanimated/plugin` **ở cuối** array plugins.
2. **Root App:** Bọc toàn bộ app trong `<GestureHandlerRootView style={{flex: 1}}>` ở `App.tsx`.
3. Nếu thiếu bước nào → app crash ngay khi render Bottom Sheet.

#### react-native-permissions (Quyền vị trí)
- **Android:** Thêm các quyền vào `AndroidManifest.xml`:
  ```xml
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
  ```
- **iOS:** Thêm vào `Info.plist`:
  ```xml
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>Ứng dụng cần vị trí để hiển thị vị trí tài xế trên bản đồ</string>
  ```

---

## 6. Kế Hoạch Thực Hiện (Implementation Phases)

### Phase 1: Foundation (~2-3h)
- [ ] Cài dependencies
- [ ] Config `babel.config.js` — thêm plugin `react-native-reanimated/plugin`
- [ ] Config `App.tsx` — bọc root app trong `<GestureHandlerRootView>`
- [ ] Config Google Maps API Key vào `AndroidManifest.xml`
- [ ] Config quyền vị trí (Android `AndroidManifest.xml` + iOS `Info.plist`)
- [ ] Tạo folder structure (`src/...`)
- [ ] Tạo theme tokens (`src/theme/index.ts`)
- [ ] Tạo types & mock data
- [ ] Tạo Zustand stores (auth + trip)
- [ ] Tạo `src/utils/formatPhone.ts` — helper format số ĐT

### Phase 2: Navigation + Auth (~1-2h)
- [ ] Setup React Navigation
- [ ] Tạo `RootNavigator`, `AuthStack`, `MainTab`, `HomeStack`
- [ ] Tạo `LoginScreen` (PhoneInput auto-format + Password + Sign in)
- [ ] Tạo `ProfileScreen` (placeholder)

### Phase 3: Home Screen — States (~4-5h)
- [ ] Tạo `HomeScreen` với MapView + xin quyền vị trí khi mount
- [ ] Implement `StatusToggle` (Offline ↔ Online)
- [ ] Tạo `TripBottomSheet` — hiển thị theo tripStatus
- [ ] Tạo `BookingModal` — popup cuốc xe mới (mock 5s delay + countdown bar 15s)
- [ ] Implement auto-timeout: hết 15s → tự dismiss BookingModal → quay ONLINE
- [ ] Implement `StepIndicator` (Arriving → Waiting → Finishing)
- [ ] Tạo `CustomerInfo` component
- [ ] Tạo `CanceledModal` — modal "Chuyến đi đã bị huỷ" + nút OK
- [ ] Mock "Simulate Cancel" button (dev-only) ở ARRIVING/WAITING
- [ ] Wire up toàn bộ state transitions (bao gồm edge cases)

### Phase 4: Communication Screens (~1-2h)
- [ ] Tạo `ChatScreen` (mock messages, mock ảnh, FlatList)
- [ ] Tạo `CallScreen` (avatar, timer, mute/end buttons)
- [ ] Implement End call delay: setTimeout 2s giả lập ngắt kết nối trước khi goBack
- [ ] Wire icons Call + Chat từ `TripBottomSheet`

### Phase 5: Polish + Build Verify (~1h)
- [ ] Review touch targets (≥48px)
- [ ] Review responsive layout
- [ ] Android build test (`./gradlew assembleDebug`)
- [ ] Fix build errors nếu có

---

## 7. Verification Plan

### 7.1. Build Verification
```bash
cd driver-app/android && ./gradlew assembleDebug
```
Build phải pass không lỗi.

### 7.2. Manual Testing (Trên Android Emulator)

| # | Test Case | Steps | Expected |
|---|-----------|-------|----------|
| 1 | Login hiển thị đúng | Mở app | Thấy "Hello Driver!", input phone + password, nút "Sign in" |
| 2 | Phone format | Gõ "0123456789" vào ô phone | Hiển thị auto-format: `+84 123 456 789` |
| 3 | Login → Home | Nhập bất kỳ → Sign in | Chuyển sang HomeScreen, bản đồ hiện, trạng thái Offline |
| 4 | Quyền vị trí | Lần đầu vào Home | Popup xin quyền vị trí hiện ra |
| 5 | Toggle Online | Gạt toggle | Pill đổi "ONLINE", bottom sheet đổi text |
| 6 | Booking popup | Đợi 5s sau khi Online | Modal hiện: John Doe, 123 Sunshine Street, countdown bar, nút Reject/Accept |
| 7 | Booking timeout | Đợi 15s không ấn gì | Modal tự đóng, quay về ONLINE |
| 8 | Accept trip | Ấn Accept | Modal đóng, bottom sheet hiện trip info, step = ARRIVING |
| 9 | Trip flow | Ấn các nút theo thứ tự | Confirm Arrived → Waiting → Start → Serving → Finish |
| 10 | Step indicator | Quan sát qua các bước | Bar sáng dần: Arriving → Waiting → Finishing |
| 11 | Khách huỷ cuốc | Ấn "Simulate Cancel" (dev) ở ARRIVING | Modal "Chuyến đã bị huỷ" hiện → OK → ONLINE |
| 12 | Chat screen | Ấn icon chat | Mở ChatScreen, có mock messages |
| 13 | Call screen | Ấn icon call | Mở CallScreen, có avatar + timer + end call |
| 14 | End call delay | Ấn End call | Delay 2s (giả lập ngắt kết nối) → quay lại HomeScreen |

> **Lưu ý cho reviewer:** Mở emulator → chạy `npx react-native run-android` → thực hiện các test case tuần tự.

---

## 8. Ràng Buộc Kỹ Thuật

- ✅ TypeScript strict mode (`"strict": true` trong tsconfig.json)
- ✅ Không có nút Sign up (tài khoản do công ty cấp)
- ✅ Mock data only — chưa gọi API thật
- ✅ FlatList cho danh sách chat (không dùng ScrollView)
- ✅ `useCallback` + `React.memo` cho renderItem
- ✅ Touch targets ≥ 48dp
- ✅ Token lưu qua Zustand (chuyển sang react-native-keychain ở phase sau)
- ✅ Không hardcode secret trong source (Google Maps API Key quản lý riêng)
- ✅ Root app bọc trong `<GestureHandlerRootView>` (bắt buộc cho bottom-sheet)
- ✅ `babel.config.js` có plugin `react-native-reanimated/plugin` ở cuối
- ✅ Xin quyền vị trí trước khi hiển thị bản đồ
- ✅ BookingModal có countdown bar 15s, tự dismiss khi hết giờ
- ✅ Hỗ trợ state `CANCELED` — khách huỷ cuốc hiện modal thông báo
- ✅ Input phone auto-format dạng `+84 123 456 789`
- ✅ End call có delay 2s giả lập ngắt kết nối

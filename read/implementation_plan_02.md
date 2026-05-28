# Kế Hoạch Triển Khai MapBackground — Driver App Only

> **Scope:** Chỉ `driver-app/`. Customer App deferred.
> **Quyết định:** XÓA HOÀN TOÀN `react-native-maps`. Thay bằng `MapBackground` (Leaflet/WebView).

---

## Proposed Changes

### Phase 1: Dependencies — Gỡ cũ, cài mới

#### [MODIFY] [package.json](file:///d:/ride-hailing-system/driver-app/package.json)

```bash
cd driver-app
npm uninstall react-native-maps          # Xóa Google Maps + native deps
npm install react-native-webview          # WebView cho Leaflet
npm install react-native-geolocation-service  # GPS (getPosition / watchPosition)
```

> `react-native-permissions` đã có sẵn ✅

**Sau cài đặt:** Chạy `cd android && ./gradlew clean` để clear cache native cũ của react-native-maps.

---

### Phase 2: Permissions — Android & iOS

#### [MODIFY] [AndroidManifest.xml](file:///d:/ride-hailing-system/driver-app/android/app/src/main/AndroidManifest.xml)

Xác nhận có các permissions (đã có từ `react-native-permissions` setup trước):
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
```

#### [MODIFY] iOS `Info.plist`

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Ứng dụng cần quyền vị trí để hiển thị bạn trên bản đồ.</string>
```

---

### Phase 3: MapBackground Component

#### [NEW] [MapBackground.tsx](file:///d:/ride-hailing-system/driver-app/src/components/MapBackground.tsx)

Chuyển [MapBackground.txt](file:///d:/ride-hailing-system/MapBackground.txt) thành component chính thức. Cải thiện:
- Thêm props `initialLat`, `initialLng` (configurable, default UIT)
- Thêm prop `onMapMove?: (lat: number, lng: number) => void` callback
- Export `MapBackgroundRef` interface
- `React.memo` wrapper để tránh re-mount WebView

---

### Phase 4: Refactor HomeScreen — Thay thế react-native-maps

#### [MODIFY] [HomeScreen.tsx](file:///d:/ride-hailing-system/driver-app/src/screens/HomeScreen.tsx)

**Xóa:**
```diff
-import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
-const [mapRegion, setMapRegion] = useState(MAP_INITIAL_REGION);
-// useEffect chỉnh region (dòng 103-126)
-// <MapView>...</MapView> block (dòng 146-208)
```

**Thêm:**
```diff
+import MapBackground, { MapBackgroundRef } from '../components/MapBackground';
+const mapRef = useRef<MapBackgroundRef>(null);
```

**Logic thay thế map render:**
```typescript
// Thay <MapView> bằng:
<MapBackground
    ref={mapRef}
    initialLat={21.028511}
    initialLng={105.804817}
/>

// Khi ARRIVING → vẽ markers + route
useEffect(() => {
    if (tripStatus === TripStatus.ARRIVING && currentTrip && mapRef.current) {
        mapRef.current.updateMarkers(
            mockDriverLoc.latitude, mockDriverLoc.longitude,
            currentTrip.pickup.latitude, currentTrip.pickup.longitude
        );
        fetchRoute(mockDriverLoc, currentTrip.pickup)
            .then(geoJson => mapRef.current?.drawRoute(geoJson));
    }
    if (tripStatus === TripStatus.SERVING && currentTrip && mapRef.current) {
        mapRef.current.updateMarkers(
            currentTrip.pickup.latitude, currentTrip.pickup.longitude,
            currentTrip.dropoff.latitude, currentTrip.dropoff.longitude
        );
        fetchRoute(currentTrip.pickup, currentTrip.dropoff)
            .then(geoJson => mapRef.current?.drawRoute(geoJson));
    }
    // Clear khi về ONLINE
    if (tripStatus === TripStatus.ONLINE && mapRef.current) {
        mapRef.current.clearRoute();
        mapRef.current.clearDrivers();
    }
}, [tripStatus, currentTrip]);
```

#### [NEW] [fetchRoute.ts](file:///d:/ride-hailing-system/driver-app/src/utils/fetchRoute.ts)

Gọi OSRM (miễn phí, không cần API key) để lấy GeoJSON:
```typescript
export async function fetchRoute(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
): Promise<any | null> {
    const url = `https://router.project-osrm.org/route/v1/driving/` +
        `${from.longitude},${from.latitude};${to.longitude},${to.latitude}` +
        `?geometries=geojson&overview=full`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.[0]) {
        return { type: 'Feature', geometry: data.routes[0].geometry };
    }
    return null;
}
```

#### [NEW] [useLocationPermission.ts](file:///d:/ride-hailing-system/driver-app/src/hooks/useLocationPermission.ts)

Refactor logic permission từ HomeScreen thành reusable hook:
```typescript
// Trích xuất useEffect permission (dòng 59-86 hiện tại)
// → hook trả về { granted, location }
// Dùng react-native-geolocation-service thay vì chỉ check permission
```

---

### Phase 5: Performance Patterns (Critical)

#### Anti-Rerender cho `onMapMove`

```typescript
// ĐÚNG: useRef, KHÔNG re-render
const lastCenter = useRef({ lat: 0, lng: 0 });
const handleMapMove = useCallback((lat: number, lng: number) => {
    lastCenter.current = { lat, lng };
}, []);

// SAI: useState → re-render → WebView re-mount
const [center, setCenter] = useState({...}); // ❌ TRÁNH
```

#### Batch injectJavaScript

```typescript
// SAI: Gọi riêng lẻ → 3 bridge calls
mapRef.current?.clearRoute();
mapRef.current?.updateMarkers(...);
mapRef.current?.drawRoute(...);

// ĐÚNG: Gộp trong 1 useEffect, gọi tuần tự sau clear
useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.clearRoute();
    // setTimeout nhỏ để đảm bảo clear xong
    setTimeout(() => {
        mapRef.current?.updateMarkers(...);
        mapRef.current?.drawRoute(...);
    }, 50);
}, [tripStatus]);
```

---

## Tổng kết Files

| Action | File | Mô tả |
|--------|------|-------|
| **NEW** | `src/components/MapBackground.tsx` | Component Leaflet/WebView |
| **NEW** | `src/utils/fetchRoute.ts` | OSRM route fetcher |
| **NEW** | `src/hooks/useLocationPermission.ts` | GPS permission hook |
| **MODIFY** | [src/screens/HomeScreen.tsx](file:///d:/ride-hailing-system/driver-app/src/screens/HomeScreen.tsx) | Xóa react-native-maps, dùng MapBackground ref |
| **MODIFY** | [package.json](file:///d:/ride-hailing-system/backend/package.json) | Xóa maps, thêm webview + geolocation |
| **MODIFY** | `android/app/src/main/AndroidManifest.xml` | Xác nhận permissions |
| **DELETE dep** | `react-native-maps` | Xóa hoàn toàn khỏi project |

---

## Verification Plan

1. `npx react-native run-android` — build thành công sau khi xóa react-native-maps
2. HomeScreen hiển thị Leaflet map (OpenStreetMap tiles)
3. Toggle Online → sau 5s nhận booking → Accept → map vẽ route dashed đến pickup
4. Start Trip → map vẽ route solid đến dropoff  
5. Finish Trip → rating flow → Complete → map clear route/markers
6. Kéo map → `onMapMove` log tọa độ, KHÔNG re-render toàn screen

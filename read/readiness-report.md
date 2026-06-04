# 📋 Hệ Thống Đã Sẵn Sàng (Readiness & Current Status Report)

> **Ngày báo cáo:** 2026-06-02
> **Trạng thái:** Driver App và NestJS Backend đã tích hợp **100%** sẵn sàng để kiểm thử End-to-End (E2E) qua Postman / Mobile Emulator.

---

## 1. Hiện Trạng Hệ Thống & Các Chức Năng Đang Hoạt Động

Dự án hiện tại được thu hẹp tập trung vào **Driver App** và **NestJS Backend**. Các cấu phần lõi này đã được liên thông hoàn toàn thông qua bộ kết nối REST API (`apiClient.ts`) và WebSocket Real-time (`socketClient.ts`).

### 🚀 Danh sách chức năng hoạt động hoàn chỉnh:

*   **🔒 Đăng nhập thực tế & Bảo mật:**
    *   Tài xế nhập SĐT (+84 format tự động) + Mật khẩu.
    *   App gọi `POST /auth/driver/login` của Backend, nhận JWT Token.
    *   JWT Token được lưu trữ trong `AsyncStorage` để giữ phiên đăng nhập và tự động gửi kèm Header `Authorization: Bearer <token>` qua mọi request sau đó.
    *   Đã thiết lập cơ chế **Đăng xuất an toàn**: Xoá token trên thiết bị và điều hướng tức thời về màn đăng nhập.
    *   Lỗi server hiển thị **Inline** ngay bên dưới form (Ví dụ: *"Thông tin đăng nhập không chính xác"*) thay vì văng Alert. Lỗi tự biến mất khi bắt đầu gõ Text.
*   **🟢 Trạng thái Hoạt động (Online/Offline):**
    *   Nút bật/tắt Online trên màn hình chính gọi điện trực tiếp API `PATCH /drivers/availability`.
    *   Thay đổi trạng thái tài xế trên DB thực tế (tạo tiền đề cho Dispatcher dò tìm địa lý).
*   **📡 Socket.IO Real-time & Định vị GPS (Streaming):**
    *   Ngay khi Online, Hook `useLocationStream` tự động kích hoạt, theo dõi GPS mỗi **5 giây/lần**.
    *   Tự động gửi gói tin websocket `driver:update_location` để cập nhật tọa độ (`lat`, `lng`), hướng di chuyển (`heading`), và vận tốc (`speed`) lên Redis GEO của Backend để khách hàng dò tìm.
*   **⚡ Luồng đời sống chuyến đi (Trip Lifecycle - Realtime):**
    *   Thay vì dùng Timer ảo, tài xế lắng nghe event socket `server:ride_request` từ Backend để mở hộp thoại nhận chuyến (`BookingModal`) kèm thanh đếm ngược 15s.
    *   Nếu hết hạn, tài xế nhận event `server:offer_expired` để tự thu hồi hộp thoại nhận chuyến mà không bị đơ màn hình.
    *   Mọi tương tác như **Nhận cuốc**, **Báo đã đến đón**, **Bắt đầu chuyến**, **Hoàn thành**, và **Đánh giá** đều thực hiện qua REST API zero-arguments (`tripStore` tự động map UUID từ state trong store) đồng bộ trực tiếp lên Database.
*   **🛠️ Đồng bộ khi mất mạng (Reconnect Sync):**
    *   Nếu mất sóng Wifi/4G giữa chuyến đi và có kết nối lại, Socket sẽ kích hoạt sự kiện `connect`, tự động gọi `GET /rides/:id` để khôi phục trạng thái UI chính xác, tránh kẹt màn hình nếu khách hàng đã huỷ chuyến lúc mất mạng.
*   **📊 Màn hình cá nhân (Profile & Lịch sử):**
    *   Màn hình cá nhân hiển thị chuẩn dữ liệu từ `GET /drivers/me`.
    *   Hàng thống kê chuyến đi tự động fetch API lịch sử `/drivers/trips/history` để đếm tổng số chuyến. Có tích hợp hiển thị trạng thái chờ `–` tránh lỗi chớp giật chữ số 0.

---

## 2. File Cấu Hình `.env` Cho Backend (Database & Service)

File `.env` đã được tạo tự động tại đường dẫn `backend/.env`. Bạn chỉ cần khởi động PostgreSQL và Redis cục bộ rồi cấu hình các tham số sau nếu có thay đổi:

```ini
# Cấu hình Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=ride_hailing

# Cấu hình Redis (Redis Cache & Geo Search)
REDIS_HOST=localhost
REDIS_PORT=6379

# Cấu hình JWT Token
JWT_SECRET=super-secret-key-12345
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d

# Môi trường chạy
NODE_ENV=development

# Google Maps API Key (Mặc định 'mock-api-key' để chạy dữ liệu giả lập cước/quãng đường)
GOOGLE_MAPS_API_KEY=mock-api-key
```

---

## 3. Hướng Dẫn Kiểm Thử Bằng Postman & Socket Client

Để bắt đầu quy trình test API, hãy chắc chắn Postgres và Redis đã được bật, sau đó khởi động Backend:
```bash
# Di chuyển vào backend và chạy
npm run start:dev
```

### 🎯 API 1: Đăng ký / Đăng nhập tài xế (Postman)
*   **Đăng ký tài xế mới:**
    *   `POST http://localhost:3000/auth/driver/register`
    *   Body (JSON):
        ```json
        {
          "phone_number": "+84987654321",
          "password": "super-password-123"
        }
        ```
*   **Đăng nhập lấy token:**
    *   `POST http://localhost:3000/auth/driver/login`
    *   Copy token JWT từ `access_token` để nhét vào phần Authorization Bearer của các request kế tiếp.

### 🎯 API 2: Quản lý trạng thái chuyến đi (Postman - Mô phỏng luồng gọi từ Driver App)
*   **Cập nhật Online/Offline:**
    *   `PATCH http://localhost:3000/drivers/availability`
    *   Header: `Authorization: Bearer <jwt-token>`
*   **Lấy chuyến chạy hiện tại:**
    *   `GET http://localhost:3000/rides/current`
    *   Header: `Authorization: Bearer <jwt-token>`
*   **Cập nhật tiến độ chuyến đi:**
    *   `PATCH http://localhost:3000/rides/<trip_id>/status`
    *   Header: `Authorization: Bearer <jwt-token>`
    *   Body (JSON):
        ```json
        {
          "status": "arrived" // Hoặc "in_progress", "completed", "cancelled"
        }
        ```

### 🔌 Socket Event Testing:
*   Mở một Socket.IO client (như Postman v10 có hỗ trợ Socket.IO hoặc công cụ Hoppscotch).
*   Kết nối tới `ws://localhost:3000` kèm thông báo auth token.
*   **Lắng nghe event:** `server:ride_request`
*   **Gửi event cập nhật vị trí:** `driver:update_location`
    ```json
    {
      "trip_id": "uuid-trip-here",
      "latitude": 10.762622,
      "longitude": 106.660172,
      "heading": 90,
      "speed": 35
    }
    ```

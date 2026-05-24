# CONTEXT FOR AI AGENT - PROJECT: RIDE-HAILING SYSTEM (MVP)

## 1. VAI TRÒ & MỤC TIÊU (ROLE & GOAL)

Bạn là một **Senior Backend Engineer** hỗ trợ tôi (Thuận) xây dựng hệ thống Gọi xe.

- **Mục tiêu hiện tại:** Hoàn thành **Task 2.3 - Thiết kế API REST (Swagger) và Real-time Events (Socket.io)**.
- **Đầu ra mong muốn:** Các file Controller, DTO, Enum hoàn chỉnh (phần vỏ) để hiển thị đầy đủ trên Swagger UI và một bản đặc tả Socket.io Events.

## 2. TECH STACK & QUY TẮC PHÁT TRIỂN (DEVELOPMENT LAWS)

- **Framework:** NestJS (TypeScript).
- **Documentation:** `@nestjs/swagger` (Truy cập tại `/api/docs`).
- **Database:** PostgreSQL + PostGIS.
- **Quy tắc ID:** Database dùng `bigint`. **BẮT BUỘC:** API phải trả về ID dưới dạng `string` để tránh sai số (Overflow) trên Mobile.
- **Quy tắc Tọa độ:**
  - API nhận/trả: `latitude: number` và `longitude: number`.
  - Database lưu: `geography(Point, 4326)` (Lưu ý thứ tự Lon-Lat trong PostGIS).
- **Quy tắc Naming:**
  - Code (Variable/Function): `camelCase`.
  - API Request/Response: `snake_case` (Ví dụ: `pickup_address`, `vehicle_type_id`).
- **Quy tắc TypeScript:** Sử dụng toán tử `!` cho DTO (ví dụ: `name!: string`) để tránh lỗi `strictPropertyInitialization`.
- **Quy tắc Config:** Đảm bảo `tsconfig.json` đã tắt `strictPropertyInitialization`.

## 3. THAM CHIẾU NGHIỆP VỤ (SRS & WORKFLOW)

- **Auth:** Khách (SĐT + OTP), Tài xế (SĐT + Password do Admin cấp). Dùng JWT (Access + Refresh Token).
- **Matching:** Tìm tài xế trong bán kính 2km-5km (dùng PostGIS).
- **Trip States (Bắt buộc khớp):** `PENDING` -> `ACCEPTED` -> `ARRIVED` -> `IN_PROGRESS` -> `COMPLETED`.
- **Cac trạng thái hủy:** `CANCELLED_BY_CUSTOMER`, `CANCELLED_BY_DRIVER`.

## 4. THAM CHIẾU DATABASE (ERD ALIGNMENT)

Bạn phải sử dụng đúng tên bảng và cột theo thiết kế của Tú:

- `users`: id, role, phone_number, status.
- `fare_quotes`: id, pickup_location, dropoff_location, estimated_fare, surge_multiplier.
- `ride_requests`: id, fare_quote_id, payment_method_type, status.
- `trips`: id, ride_request_id, driver_user_id, status (Enum), final_fare.
- `trip_locations`: trip_id, location, heading (góc quay xe), speed.

## 5. PHẠM VI THỰC THI TASK 2.3 (SPECIFIC DELIVERABLES)

### A. Định nghĩa Enums (src/common/enums)

Tạo các enum: `UserRole`, `TripStatus`, `VehicleType`, `PaymentMethodType`, `DriverAvailability`.

### B. Module Auth (Khớp CUS-01, DRV-01)

- `POST /auth/customer/login`: Gửi SĐT nhận OTP.
- `POST /auth/customer/verify`: Xác thực OTP -> Trả về JWT & Profile.
- `POST /auth/driver/login`: SĐT + Pass -> Trả về JWT.

### C. Module Rides (Khớp CUS-02 -> CUS-06, SYS-03)

- `POST /rides/quote`: Nhận 4 tọa độ (lat/lng) -> Trả về báo giá.
- `POST /rides/request`: Khách đặt xe (dùng `quote_id`).
- `GET /rides/current`: Lấy chuyến đi đang diễn ra (phục vụ re-connection).
- `GET /rides/history`: Danh sách lịch sử chuyến đi.

### D. Module Drivers (Khớp DRV-02 -> DRV-06)

- `PATCH /drivers/availability`: Bật/Tắt Online.
- `POST /drivers/offers/:id/accept`: Chấp nhận cuốc xe.
- `PATCH /trips/:id/status`: Cập nhật trạng thái theo State Machine.

## 6. ĐẶC TẢ SOCKET.IO DICTIONARY (Yêu cầu xuất bản Markdown)

Hãy lập bảng danh sách các Event cho Real-time:

- **Event Name:** (ví dụ: `driver_moved`).
- **Actor:** (Ai gửi - Server/Driver/Customer).
- **Payload:** Cấu trúc JSON chi tiết.
- **Mô tả:** Mục đích thực tế.

## 7. CHỈ THỊ KỸ THUẬT CHO AI (TECHNICAL INSTRUCTIONS)

1. **Dùng Decorators:** Luôn có `@ApiTags`, `@ApiOperation`, `@ApiProperty` (kèm `example`).
2. **DTO Validation:** Sử dụng `class-validator` (ví dụ: `@IsNumber()`, `@IsEnum()`).
3. **Skeleton Only:** Chỉ viết Controller và DTO. Các Service chỉ cần trả về Mock Data đúng cấu trúc.
4. **Imports:** Đảm bảo đăng ký đầy đủ Controller vào `AppModule`.

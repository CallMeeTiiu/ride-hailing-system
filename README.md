# 🚗 Ride-Hailing System (NestJS & React Native)

[![NestJS](https://img.shields.io/badge/backend-NestJS-red.svg?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![React Native](https://img.shields.io/badge/frontend-React%20Native-blue.svg?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/language-TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/cache-Redis-red?style=for-the-badge&logo=redis)](https://redis.io/)
[![OpenStreetMap](https://img.shields.io/badge/maps-OpenStreetMap-brightgreen?style=for-the-badge&logo=openstreetmap)](https://www.openstreetmap.org/)

Hệ thống Đặt xe công nghệ thời gian thực hoàn chỉnh bao gồm phân hệ máy chủ Backend (NestJS) điều phối và hai ứng dụng di động dành cho **Khách hàng (Customer)** và **Tài xế (Driver)** viết bằng React Native. Dự án tích hợp các giải pháp nguồn mở hoàn toàn miễn phí như bản đồ **OpenStreetMap (Leaflet)**, OSRM router và Photon geocoder.

## 👥 Đội ngũ phát triển (Team Members)

Dự án được thực hiện với sự đóng góp của các thành viên:

| Họ và Tên | MSSV | GitHub Profile |
| :--- | :---: | :--- |
| **Nguyễn Đăng Khánh** | `24520790` | Khanh23-code |
| **Trần Đỗ Anh Tú** | `24521914` | 24521914-ux |
| **Nguyễn Xuân Nhật Tân** | `24521582` | CallMeeTiiu |
| **Lý Phước Thuận** | `24521739` | phuocthuan123vt |

---

## 🇻🇳 HƯỚNG DẪN THIẾT LẬP & KHỞI CHẠY (TIẾNG VIỆT)

Tài liệu này hướng dẫn chi tiết cách thiết lập môi trường và khởi chạy hệ thống. Dự án hỗ trợ 2 phương án kiểm thử:

*   **PHƯƠNG ÁN A: TRẢI NGHIỆM NHANH (KHUYÊN DÙNG CHO HỘI ĐỒNG / CHẤM ĐIỂM)**
    Hệ thống đã được nhóm host sẵn 100% trên Cloud (Backend trên Render, Database trên Supabase và Redis Cloud). Không cần cài đặt môi trường, chỉ cần tải file APK về cài và chạy.
    ➔ Xem hướng dẫn **Phương án A**.
*   **PHƯƠNG ÁN B: TRIỂN KHAI CHẠY SOURCE CODE CỤC BỘ (LOCAL DEVELOPMENT)**
    Dành cho giảng viên hoặc lập trình viên muốn chạy thử / kiểm tra mã nguồn Backend cục bộ trên máy tính.
    ➔ Xem hướng dẫn **Phương án B**.

### Mục lục
1. [Chuẩn bị môi trường hệ thống (Chỉ dành cho Phương án B)](#1-chuẩn-bị-môi-trường-hệ-thống)
2. [Cơ cấu dự án](#2-cơ-cấu-dự-án)
3. [Khôi phục tệp cấu hình bảo mật của Backend (.env)](#3-khôi-phục-tệp-cấu-hình-bảo-mật-của-backend-env)
4. [Tải tệp cài đặt Mobile (APK) hoặc cài đặt dependency](#4-tải-tệp-cài-đặt-mobile-apk-hoặc-cài-đặt-dependency)
5. [Hướng dẫn khởi chạy chi tiết](#5-hướng-dẫn-khởi-chạy-chi-tiết)
6. [Khắc phục một số lỗi thường gặp](#6-khắc-phục-một-số-lỗi-thường-gặp)

---

### 1. Chuẩn bị môi trường hệ thống

Để chạy phân hệ Backend cục bộ trên máy tính của bạn:

*   **Node.js & npm**: Phiên bản `>= 22.11.0` (Tải từ [nodejs.org](https://nodejs.org/)).
*   **PostgreSQL**: 
    *   *Nếu sử dụng database Supabase Cloud*: Máy local **không cần** cài đặt PostgreSQL. Chỉ cần kết nối qua `.env`.
    *   *Nếu chạy offline*: Cài đặt PostgreSQL (>= 15) và tạo cơ sở dữ liệu trống.
*   **Redis**: Cần khởi chạy dịch vụ Redis Server cục bộ tại cổng mặc định `6379`.
*   **Thiết bị Android**: Điện thoại thật chạy Android hoặc trình giả lập (như LDPlayer, Nox, Bluestacks) để cài đặt APK di động.

---

### 2. Cơ cấu dự án

Thư mục gốc chứa 3 phân hệ chính:
*   `/backend`: Máy chủ NestJS Rest APIs & WebSockets.
*   `/customer-app`: Ứng dụng React Native dành cho Khách hàng.
*   `/driver-app`: Ứng dụng React Native dành cho Tài xế.

---

### 3. Khôi phục tệp cấu hình bảo mật của Backend (.env)

Tạo file mới tên là `.env` đặt tại thư mục `backend/` và copy đoạn cấu hình mẫu dưới đây (điền thông số Supabase & Redis Cloud của bạn):

```env
DB_DATABASE=your_database_name
DB_HOST=your_supabase_db_host_here
DB_PASSWORD=your_supabase_db_password_here
DB_PORT=5432
DB_USERNAME=your_supabase_db_username_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=your_redis_cloud_host_here
REDIS_PORT=your_redis_cloud_port_here

# Các khóa bên dưới dùng cho giải thuật giả lập (Mock)
GOOGLE_MAPS_API_KEY=mock-api-key
FIREBASE_PROJECT_ID=mock-project-id
FIREBASE_PRIVATE_KEY=mock-private-key
FIREBASE_CLIENT_EMAIL=mock-client-email
```

> [!NOTE]
> Các tệp APK tải từ GitHub Releases đã được cấu hình sẵn để kết nối trực tiếp đến Cloud Backend của nhóm. Do đó, bạn không cần phải sửa đổi IP cục bộ trên ứng dụng di động.

---

### 4. Tải tệp cài đặt Mobile (APK) hoặc cài đặt dependency

1.  **Cài đặt thư viện Backend**:
    ```bash
    cd backend
    npm install
    ```
2.  **Tải ứng dụng Mobile (APK)**:
    *   Truy cập vào mục **Releases** trên GitHub Repository của dự án.
    *   Tải về 2 file: `customer-app.apk` và `driver-app.apk`.
    *   Cài đặt trực tiếp lên điện thoại hoặc kéo thả vào trình giả lập Android.

---

### 5. Hướng dẫn khởi chạy chi tiết

#### 🚀 PHƯƠNG ÁN A: TRẢI NGHIỆM NHANH TRÊN MÂY (Khuyên dùng)
Hệ thống máy chủ đã hoạt động sẵn 24/7 trực tuyến:
1.  Mở điện thoại/giả lập đã cài 2 file APK ở bước 4.
2.  Đảm bảo thiết bị đã bật kết nối Internet (WiFi/4G).
3.  Mở ứng dụng và thực hiện đăng ký, tạo tài khoản và trải nghiệm luồng đặt chuyến thực tế.

#### 💻 PHƯƠNG ÁN B: TRIỂN KHAI CHẠY BACKEND TRÊN LOCAL
Nếu muốn khởi chạy mã nguồn backend ngay trên máy tính của bạn:
1.  Kích hoạt dịch vụ PostgreSQL và Redis cục bộ (nếu sử dụng local database).
2.  Khởi chạy NestJS Server:
    ```bash
    cd backend
    npm run start:dev
    ```
3.  Đảm bảo terminal báo khởi động cổng `3000` thành công.
4.  *Lưu ý*: Với cách này, bạn cần phải build lại ứng dụng di động từ source code (thay vì cài APK) và thay đổi IP kết nối cục bộ trong file `apiClient.ts` (xem chi tiết trong mã nguồn).

---

### 6. Khắc phục một số lỗi thường gặp

*   **Lỗi "Network Error" trên Mobile**: Thiết bị test chưa bật Internet hoặc máy chủ Cloud tạm thời ngắt kết nối.
*   **Lỗi "Redis connection refused" ở Backend**: Bạn chưa bật dịch vụ Redis Server trên máy tính local.
*   **Lỗi PostgreSQL Connection Refused**: Sai mật khẩu cấu hình trong `.env` hoặc Postgres service chưa hoạt động.

---
---

## 🇬🇧 ENVIRONMENT SETUP & RUNNING GUIDE (ENGLISH)

This document provides step-by-step instructions on setting up the environment and running the Ride-Hailing System. The project supports two testing methods:

*   **OPTION A: QUICK CLOUD TESTING (RECOMMENDED FOR GRADERS/COMMITTEES)**
    The entire system is already deployed and hosted 24/7 on the Cloud (Backend on Render, Database on Supabase, and Cache on Redis Cloud). No configuration is needed; just download and install the APK files.
    ➔ Jump to **Option A** guide.
*   **OPTION B: SOURCE CODE LOCAL RUN (LOCAL DEVELOPMENT)**
    For developers or code auditors who want to run the Backend NestJS server locally.
    ➔ Follow **Option B** guide.

### Table of Contents
1. [System Environment Setup](#1-system-environment-setup)
2. [Source Code Extraction & Structure](#2-source-code-extraction-structure)
3. [Restoring Backend Configuration (.env)](#3-restoring-backend-configuration-env)
4. [Installing Dependencies & Downloading Mobile Apps (APK)](#4-installing-dependencies-downloading-mobile-apps-apk)
5. [Running the System](#5-running-the-system)
6. [Troubleshooting Common Errors](#6-troubleshooting-common-errors)

---

### 1. System Environment Setup

To run the Backend locally on your machine:

*   **Node.js & npm**: Version `>= 22.11.0` (Get from [nodejs.org](https://nodejs.org/)).
*   **PostgreSQL**: 
    *   *If using Supabase Cloud*: Local machine **does not** need PostgreSQL server installed.
    *   *If running locally*: Install PostgreSQL Server (>= 15) and create an empty database.
*   **Redis**: Run Redis Server locally on default port `6379`.
*   **Android Device**: A physical Android device or emulator (e.g. LDPlayer, Nox, Bluestacks) to run the APK.

---

### 2. Source Code Extraction & Structure

The repository contains three main components:
*   `/backend`: NestJS Backend REST APIs & WebSockets.
*   `/customer-app`: React Native Mobile Customer Application.
*   `/driver-app`: React Native Mobile Driver Application.

---

### 3. Restoring Backend Configuration (.env)

Create a new file named `.env` in the `backend/` directory and copy the following template (fill in your Supabase & Redis credentials):

```env
DB_DATABASE=your_database_name
DB_HOST=your_supabase_db_host_here
DB_PASSWORD=your_supabase_db_password_here
DB_PORT=5432
DB_USERNAME=your_supabase_db_username_here
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

REDIS_HOST=your_redis_cloud_host_here
REDIS_PORT=your_redis_cloud_port_here

# Mock values for testing algorithms
GOOGLE_MAPS_API_KEY=mock-api-key
FIREBASE_PROJECT_ID=mock-project-id
FIREBASE_PRIVATE_KEY=mock-private-key
FIREBASE_CLIENT_EMAIL=mock-client-email
```

> [!NOTE]
> Pre-built APKs downloaded from GitHub Releases are pre-configured to connect directly to the cloud backend. Therefore, no local IP changes are needed in mobile files for Option A.

---

### 4. Installing Dependencies & Downloading Mobile Apps (APK)

1.  **Install Backend dependencies**:
    ```bash
    cd backend
    npm install
    ```
2.  **Download Mobile Apps (APK)**:
    *   Navigate to the **Releases** tab of the GitHub repository.
    *   Download `customer-app.apk` and `driver-app.apk`.
    *   Install them directly on your Android phone or drag-and-drop them into your emulator.

---

### 5. Running the System

#### 🚀 OPTION A: QUICK CLOUD TESTING (Recommended)
The cloud servers are online 24/7:
1.  Open the Android device/emulator with both APKs installed in step 4.
2.  Ensure your device has an active internet connection (WiFi/4G).
3.  Launch the apps, sign up, and start testing the real-time booking flows.

#### 💻 OPTION B: LOCAL BACKEND EXECUTION
If you wish to run the NestJS Backend server locally:
1.  Start local PostgreSQL and Redis services (if using local database).
2.  Launch NestJS Backend:
    ```bash
    cd backend
    npm run start:dev
    ```
3.  Verify the server is running successfully on port `3000`.
4.  *Note*: If you run the backend locally, you must build the mobile apps from source code (instead of installing APKs) and update the API base URL to your computer's local IP address (detailed in the source code).

---

### 6. Troubleshooting Common Errors

*   **Network Error on Mobile**: The mobile device has no internet access, or the Cloud Backend on Render is offline.
*   **Redis connection refused**: The Redis server is not running on your local machine.
*   **Postgres Connection Refused**: Incorrect database password in `.env` or local Postgres service is not running.

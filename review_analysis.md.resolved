# Kết quả kiểm tra sơ đồ luồng dữ liệu (review.md)

Đã cross-check toàn bộ 12 mục sơ đồ luồng trong [review.md](file:///d:/SE104.Q21-DoAn/review.md) với code backend thực tế (23 Service, 20 DTO Request).

---

## 🔴 LỖI NGHIÊM TRỌNG

### 1. Đánh số mục bị sai & nhảy cóc

| Mục hiện tại | Vấn đề | Đề xuất sửa |
|---|---|---|
| `2.3.1.1` | Đánh số sai cấp (phải là `2.3.1`) | → `2.3.1 Yêu cầu thay đổi quy định` |
| Nhảy từ `2.3.6` → `2.3.8` | Thiếu `2.3.7` | → Thêm Giao hàng dịch vụ (hoặc quản lý sản phẩm) |
| `2.3.11` lặp 2 lần | BC DT SP và BC DT DV trùng số | → Mục cuối đổi thành `2.3.12` |
| Thiếu `2.3.2`, `2.3.3` | Không có Quản lý KH, Quản lý SP | → Thêm 2 mục (xem mục THIẾU bên dưới) |

### 2. Thuật toán nhảy bước không tồn tại

| Mục | Lỗi | Chi tiết |
|---|---|---|
| NCC (L17) | `B5: Nếu bị trùng thì đến B9` | Nhưng chỉ có B1–B8. Phải là **B8** (Kết thúc) |
| Phiếu mua (L115) | `B5: đến B11` | Chỉ có B1–B10. Phải là **B10** |
| Phiếu bán (L138) | `B6: đến B12` | Chỉ có B1–B11. Phải là **B11** |
| Phiếu DV (L160) | `B7: đến B13` | Chỉ có B1–B12. Phải là **B12** |

---

## 🟡 SAI LỆCH VỚI CODE THỰC TẾ

### 3. NCC: kiểm tra trùng SĐT, không phải tên (L8 vs L16)

- **Review nói**: D3 kiểm tra trùng **SĐT** (L8) nhưng B4 lại kiểm tra trùng **Tên** (L16)
- **Code thực tế** ([NhaCungCapRequest.java](file:///d:/SE104.Q21-DoAn/backend/src/main/java/com/se104/goldstore/dto/request/NhaCungCapRequest.java)): validate `@Pattern soDienThoai` 10 số + `@NotBlank tenNhaCungCap`
- **Kết luận**: D3 và B4 đang **mâu thuẫn nhau**. Cần thống nhất: kiểm tra trùng SĐT hay trùng Tên?

### 4. NCC thiếu trường `ghiChu`

- **Code**: [NhaCungCapRequest](file:///d:/SE104.Q21-DoAn/backend/src/main/java/com/se104/goldstore/dto/request/NhaCungCapRequest.java#6-69) có `tenNhaCungCap`, `soDienThoai`, `diaChi`, **`ghiChu`**, `isActive`
- **Review D1**: Chỉ có (Tên, SĐT, Địa chỉ) — **thiếu Ghi chú**

### 5. ĐVT: Trường dữ liệu D1 đúng ✅

- **Code**: [DonViTinhRequest](file:///d:/SE104.Q21-DoAn/backend/src/main/java/com/se104/goldstore/dto/request/DonViTinhRequest.java#7-71) có `tenDonViTinh`, `loaiDonVi`, `heSoQuyDoi` → khớp với D1 trong review

### 6. Phiếu mua: thiếu `maDonViTinh` trong D1

- **Code** (`PhieuMuaHangRequest.ItemRequest`): `maSanPham`, `soLuongMua`, **`maDonViTinh`**, `donGia`
- **Review D1** (L104): "Mã sản phẩm, Số lượng mua, Đơn giá mua" — **thiếu Mã đơn vị tính**

### 7. Phiếu mua: thiếu bước cập nhật giá bán

- **Code thực tế**: Khi nhập hàng, backend cập nhật `giaMua` → tính lại `giaBan = giaMua × (1 + tiLe)`
- **Review B6** (L116): Chỉ nói "Cập nhật SL tồn kho" — **thiếu "Cập nhật giá mua và giá bán"**

### 8. Phiếu bán: D1 thiếu Ngày lập

- **Code**: [PhieuBanHangRequest](file:///d:/SE104.Q21-DoAn/backend/src/main/java/com/se104/goldstore/dto/request/PhieuBanHangRequest.java#11-82) có `ngayLapPhieuBan`, `maKhachHang`, `items`
- **Review D1** (L126): "Ngày lập, Mã khách hàng" → ✅ nhưng item chỉ có "Mã SP, SL bán" — **thiếu** (không có đơn giá vì đơn giá bán tự tính từ DB, điều này đúng)

### 9. Phiếu DV: D1 sai trường

- **Code** (`PhieuDichVuRequest.ItemRequest`): `maLoaiDichVu`, `soLuongDichVu`, `chiPhiRieng`, `donGiaDuocTinh`, `tienTraTruoc`, `ngayGiao`
- **Review D1** (L147): "Loại dịch vụ, Đơn giá được tính, Số lượng, Số tiền trả trước" — **thiếu `chiPhiRieng`**

### 10. Phiếu DV: Tỉ lệ hardcode 50%

- **Review** (L159): nói `50% x Tổng tiền`
- **Code thực tế**: dùng `ThamSo.tiLeTraTruoc` (configurable) — **không nên hardcode 50%**, phải ghi "Tỉ lệ trả trước trong THAMSO"

---

## 🔵 THIẾU SƠ ĐỒ LUỒNG

So với danh sách nghiệp vụ (Bảng 2.1 trong Chapter 2), các yêu cầu sau **chưa có sơ đồ luồng**:

| # | Nghiệp vụ thiếu | Backend Service tương ứng | Ghi chú |
|---|---|---|---|
| 1 | **Quản lý khách hàng** | `KhachHangService` | CRUD KH giống NCC, nên có mục `2.3.2` |
| 2 | **Quản lý sản phẩm** | `SanPhamService` | Có logic giá bán tự động, cần mục `2.3.3` |
| 3 | **Giao hàng dịch vụ** | `PhieuDichVuService.deliverItem/deliverAll` | Nghiệp vụ con của DV, có thể gộp vào 2.3.6 hoặc tách `2.3.7` |
| 4 | **Quản lý người dùng / Phân quyền** | `NguoiDungService`, `PhanQuyenService` | Cần mục riêng nếu theo format QLThuVien (mục 2.3.9 của QLThuVien) |

---

## 🟢 ĐÚNG & TỐT

| Mục | Đánh giá |
|---|---|
| Đơn vị tính (2.3.1) | ✅ D1 đúng trường (Tên, Loại, Hệ số) |
| Loại DV (2.3.1) | ✅ Logic đúng |
| Tỉ lệ trả trước (2.3.1) | ✅ Logic đúng (nhưng cần ghi THAMSO thay vì hardcode) |
| Tra cứu SP (2.3.8) | ✅ Đúng |
| Tra cứu phiếu DV (2.3.9) | ✅ Đúng |
| BC tồn kho (2.3.10) | ✅ Thuật toán tính Tồn cuối = Tồn đầu + Nhập − Xuất đúng |
| BC DT SP (2.3.11) | ✅ Đúng |
| BC DT DV (2.3.12) | ✅ Đúng |

---

## 📋 TÓM TẮT HÀNH ĐỘNG

> **Ưu tiên 1**: Sửa 4 lỗi nhảy bước (B9/B11/B12/B13 không tồn tại)
> **Ưu tiên 2**: Sửa đánh số mục (bỏ `.1`, thêm 2.3.2/2.3.3, đổi 2.3.11 cuối → 2.3.12)
> **Ưu tiên 3**: Bổ sung trường thiếu (ghiChu NCC, maDonViTinh phiếu mua, chiPhiRieng phiếu DV)
> **Ưu tiên 4**: Thêm 2–4 sơ đồ luồng còn thiếu

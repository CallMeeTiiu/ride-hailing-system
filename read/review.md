Hãy viết lại cấu trúc JSX và StyleSheet cho component StatusToggle theo nguyên tắc Flexbox sau để đảm bảo chữ luôn nằm ngay ngắn ở giữa phần không gian còn lại:

Container (Pill): - Đặt chiều rộng cố định (VD: width: 150), chiều cao cố định (VD: height: 52), borderRadius: 26.

Sử dụng paddingHorizontal: 6 (hoặc 8) để khoảng cách từ nút tròn tới viền ngoài luôn đều đặn ở cả 2 bên.

flexDirection: 'row', alignItems: 'center'.

Cách chia Layout bên trong (Inner Layout):

Nút tròn (Thumb): Kích thước cố định (VD: width: 40, height: 40, borderRadius: 20).

Đoạn Text ("ONLINE" / "OFFLINE"): Bắt buộc phải có flex: 1 và textAlign: 'center'. Điều này giúp khung text tự động giãn ra chiếm trọn phần không gian còn lại trong Container, đẩy chữ vào chính giữa phần không gian đó.

Khi ở trạng thái OFFLINE: Render [Nút tròn] trước, [Text] sau.

Khi ở trạng thái ONLINE: Render [Text] trước, [Nút tròn] sau. (Hoặc dùng flexDirection: 'row-reverse').

Yêu cầu Output:
Chỉ cần trả về đoạn code React Native (JSX + StyleSheet) đã được tối ưu hóa cho component StatusToggle. Chú ý dùng LayoutAnimation hoặc Reanimated để lúc gạt qua lại nó mượt mà.
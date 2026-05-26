Yêu cầu luồng giao diện (The Flow):
Khi chuyến đi kết thúc (State FINISHED), app sẽ tự động hiển thị luồng đánh giá gồm 2 bước nằm trong Bottom Sheet:

Bước 1: Màn hình Your Mood (Đánh giá cảm xúc)

Dựa trên ảnh 1, hiển thị câu hỏi "What's Your Mood about this customer?".

Render một Grid chứa các Emoji để tài xế chọn.

Yêu cầu đặc biệt: Thay vì chỉ có 9 emoji, hãy thiết kế 10 tùy chọn. Tùy chọn thứ 10 là một "Ô rỗng" (hoặc icon No-Emoji/Skip) để tài xế chọn nếu họ không muốn để lại cảm xúc.

Khi ấn "Submit" -> Chuyển sang Bước 2.

Bước 2: Màn hình Rate Customer (Đánh giá Sao)

Dựa trên ảnh 2, đổi tiêu đề thành "Rate Customer".

Thay đổi Data: Thay thông tin xe (Mercedes-Benz...) thành thông tin Khách hàng (Avatar, Tên khách, Số điện thoại).

Render component 5 ngôi sao để chấm điểm (1 đến 5).

Khi ấn "Submit" -> Hoàn tất luồng, cập nhật State về lại trạng thái chờ cuốc mới (ONLINE).

Yêu cầu Output (Deliverables):
Hãy xuất ra một bản kế hoạch bằng Markdown rõ ràng, bao gồm:

1. Cập nhật Zustand Store (tripStore)

Các state mới cần thêm: customerMood (có thể null/empty), customerRating (number).

Các action xử lý chuyển bước: submitMood(), submitRating().

2. Bóc tách Component chi tiết

EmojiGrid: Logic render 10 item (9 emoji + 1 empty/skip option), xử lý trạng thái selected (viền vàng).

StarRating: Logic chọn 1-5 sao.

CustomerRatingBottomSheet: Component cha bọc 2 bước trên, xử lý animation chuyển từ view Mood sang view Rating mượt mà bên trong cùng một Bottom Sheet (không đóng mở lại sheet).

3. Gợi ý cấu trúc Mock Data

Viết TypeScript interface cho mảng data Emoji có chứa phần tử "Empty" đặc biệt này.

Ràng buộc:

Đảm bảo thiết kế component dễ tái sử dụng.

Code TypeScript chuẩn strict mode, tối ưu re-render.
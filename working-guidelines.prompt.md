# 🛠 Team Working Guidelines

Tài liệu này là quy ước làm việc chung cho cả thành viên trong team và AI agent khi tham gia dự án `ride-hailing-system`.

Mục tiêu của guideline:

- Giữ cách làm việc nhất quán giữa các phân hệ.
- Giúp người review hiểu thay đổi nhanh và đúng trọng tâm.
- Giảm rủi ro sửa lan ngoài phạm vi, lệch API hoặc bỏ sót bước kiểm tra.

## 1. Cấu trúc dự án

- `backend`: Backend service
- `customer-app`: Ứng dụng khách hàng
- `driver-app`: Ứng dụng tài xế

Dự án chủ động không sử dụng thư mục `shared`, vì vậy mọi thay đổi ở API, model dùng chung hoặc business logic dùng chung phải được kiểm tra tác động và đồng bộ thủ công giữa các phân hệ.

## 2. Quy tắc nhánh (Git Branching)

Sử dụng **GitHub Flow**. Mọi nhánh đều tách từ `main`.

**Công thức đặt tên nhánh:** `[mảng]/[loại]/[tên-tính-năng]`

- **Mảng:** `be` (Backend), `cust` (App khách), `driver` (App tài xế), `all`
- **Loại:** `feat` (tính năng mới), `fix` (sửa lỗi), `refactor` (cải tổ code), `docs` (tài liệu)
- **Ví dụ:** `be/feat/calculate-price`, `cust/fix/login-ui`, `all/docs/setup-guide`

## 3. Tiêu chuẩn commit

Sử dụng **Conventional Commits**. Có thể viết bằng tiếng Việt hoặc tiếng Anh, nhưng nên ngắn gọn, rõ hành động chính.

**Công thức:** `<type>: <mô tả ngắn>`

- `feat: <nội dung>`
- `fix: <nội dung>`
- `refactor: <nội dung>`
- `docs: <nội dung>`

Ví dụ:

- `feat: thêm API đăng ký tài xế`
- `fix: sửa lỗi không hiển thị bản đồ trên Android`

## 4. Quy tắc thực hiện task

Trước khi bắt đầu một task, cần làm rõ tối thiểu các ý sau:

- Mục tiêu của task là gì
- Đầu ra mong muốn là gì
- Ảnh hưởng phân hệ nào: `backend`, `customer-app`, `driver-app`
- Ai là owner chính của task

Trong khi thực hiện:

- Chỉ sửa đúng các file và phân hệ phục vụ task đang làm.
- Không tự ý refactor diện rộng, đổi naming hoặc đổi style toàn repo nếu task không yêu cầu.
- Không sửa hoặc revert phần đang được người khác làm nếu chưa thống nhất trước.
- Nếu phát hiện vấn đề khác ngoài scope hiện tại, ghi chú lại trong PR hoặc báo riêng, không tự ý mở rộng phạm vi sửa.

## 5. Definition of Done

Một task chỉ được xem là hoàn thành khi đáp ứng đủ các điều kiện sau:

- Code chạy được ở môi trường local liên quan.
- Đã tự review lại diff trước khi tạo PR.
- Đã kiểm tra các luồng chính bị ảnh hưởng bởi thay đổi.
- Không commit secret, file build, dữ liệu tạm hoặc file không cần thiết.
- Nếu có thay đổi API, UI, config hoặc logic chung, đã ghi rõ ảnh hưởng trong PR.
- Nếu có thay đổi tài liệu, cách chạy dự án, config, migration hoặc seed data, đã cập nhật tài liệu tương ứng hoặc ghi rõ phần cần cập nhật.
- Nếu task liên quan nhiều phân hệ, đã ghi rõ phần nào làm trong PR hiện tại và phần nào cần đồng bộ hoặc làm tiếp.

## 6. Quy tắc thay đổi API và logic chung

Nếu thay đổi request, response, field name, validation, business rule hoặc dữ liệu dùng chung:

- Phải mô tả rõ thay đổi trong PR.
- Phải cập nhật tài liệu liên quan trong cùng PR hoặc ghi rõ cần cập nhật ở đâu.
- Phải ghi rõ phân hệ nào bị ảnh hưởng: `backend`, `customer-app`, `driver-app`.
- Phải nhắc rõ những nơi cần đồng bộ thủ công vì dự án không sử dụng thư mục `shared`.

Không merge thay đổi API hoặc logic chung nếu người review chưa hiểu rõ tác động liên phân hệ.

## 7. Testing tối thiểu trước khi tạo PR

Mỗi PR phải có phần mô tả cách kiểm tra đủ để reviewer hoặc người khác có thể làm lại.

Yêu cầu tối thiểu:

- Backend: chạy lint/test liên quan đến phần vừa sửa nếu dự án đã có sẵn script.
- Frontend/Mobile: kiểm tra lại luồng chính bị ảnh hưởng trên app hoặc simulator/emulator nếu có thể.
- Bug fix: ghi rõ cách reproduce lỗi cũ và cách xác nhận lỗi đã hết.
- UI change: đính kèm ảnh chụp màn hình hoặc video ngắn trong PR.
- Nếu chưa thể test đầy đủ, phải ghi rõ lý do và rủi ro còn lại trong phần mô tả PR.

## 8. Quy trình Pull Request

Mọi PR gửi lên phải giúp người review trả lời được 3 câu hỏi:

- Đây là thay đổi gì?
- Tại sao cần thay đổi này?
- Kiểm tra thay đổi này như thế nào?

### 8.1. Tiêu đề PR

**Công thức:** `[Phân hệ] <Loại>: <Mô tả ngắn gọn>`

Ví dụ:

- `[BE] feat: viết API đăng ký tài xế`
- `[CUST] fix: lỗi không hiển thị bản đồ trên Android`
- `[DRIVER] refactor: tối ưu logic nhận chuyến`
- `[ALL] docs: cập nhật tài liệu API chung`

### 8.2. Mô tả PR

PR phải có đủ các phần sau:

- Tóm tắt thay đổi
- Mục tiêu hoặc lý do thay đổi
- Phạm vi thay đổi
- Cách kiểm tra
- Ảnh hưởng liên phân hệ
- Ảnh/video nếu có thay đổi UI
- Rủi ro hoặc lưu ý cho reviewer nếu có

### 8.3. Review và merge

- Assignee: tự gán người làm.
- Reviewer: gán ít nhất 1 người liên quan đến phân hệ bị ảnh hưởng.
- Reviewer không được bấm `Approve` nếu chưa đọc code hoặc chưa hiểu logic.
- Nếu có chỗ chưa ổn, comment trực tiếp đúng dòng code hoặc phần mô tả PR.
- Chỉ merge khi không còn `Request changes` đang mở.
- Ưu tiên dùng `Squash and merge` để giữ lịch sử `main` gọn.
- Sau khi merge, xóa nhánh ngay.

## 9. Quy tắc làm việc với AI agent

AI agent phải tuân thủ tất cả guideline ở trên như một thành viên trong team, đồng thời có thêm các ràng buộc sau:

- Ưu tiên thay đổi nhỏ, đúng phạm vi, dễ review và dễ bảo trì.
- Không tự ý commit, push, merge, xóa file hoặc revert thay đổi của người khác nếu chưa được yêu cầu rõ ràng.
- Phải nêu rõ giả định nếu yêu cầu chưa đầy đủ hoặc có nhiều cách hiểu.
- Không tự ý đổi cấu trúc lớn, schema, API contract hoặc refactor diện rộng mà không cảnh báo trước.
- Phải kiểm tra `.gitignore` để tránh đưa `node_modules`, `.env`, API key, token hoặc file nhạy cảm vào commit.
- Khi thêm config mới, migration, seed data hoặc thay đổi cách chạy dự án, phải cập nhật hoặc nhắc cập nhật tài liệu tương ứng.

## 10. Nguyên tắc chung về an toàn mã nguồn

- Không commit `.env`, API key, token, file chứa thông tin nhạy cảm hoặc dữ liệu thật của người dùng.
- Không hardcode secret trong source code.
- Không đưa file build, thư mục dependency hoặc file phát sinh không cần thiết vào commit.
- Nếu chưa chắc một file có nên commit hay không, kiểm tra lại `.gitignore` và diff trước khi tạo PR.

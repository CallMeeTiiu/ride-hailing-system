1. Giữ lại react-native-maps làm fallback hay xóa hoàn toàn?
Quyết định: XÓA HOÀN TOÀN.

Lý do:

Giữ đúng tinh thần MVP (Tối ưu nguồn lực): Việc duy trì song song 2 luồng logic bản đồ (Native và WebView) trong codebase sẽ làm tăng gấp đôi thời gian bảo trì, test và fix bug. Ở giai đoạn này, chúng ta cần tốc độ và sự đơn giản.

Giảm thiểu dung lượng và thời gian build: react-native-maps mang theo rất nhiều native dependencies (đặc biệt là Google Play Services trên Android). Xóa nó đi sẽ giúp app nhẹ hơn đáng kể và thời gian build Gradle/Xcode nhanh hơn.

Không sợ mất code: Git history đã lưu lại toàn bộ code cũ. Nếu sau này scale up dự án, có budget và thấy WebView không còn đáp ứng được hiệu năng, bạn hoàn toàn có thể checkout lại các commit cũ để khôi phục react-native-maps dễ dàng.

2. Setup Navigation Structure cho Customer App
Quyết định: Xây dựng cấu trúc AuthStack + MainTab tương tự Driver App. Sự đồng nhất về mặt kiến trúc Navigation giữa Customer App và Driver App sẽ giúp bạn tái sử dụng được nhiều logic/component (như Header, TabBar tùy chỉnh) và dễ dàng quản lý luồng điều hướng hơn.

Bạn nên thiết lập cấu trúc Navigation cho Customer App cụ thể như sau:

RootNavigator: Xử lý logic chuyển đổi dựa trên trạng thái đăng nhập (đọc từ Zustand hoặc AsyncStorage).

AuthStack (Dành cho người dùng chưa đăng nhập):

LoginScreen: Nhập số điện thoại.

OTPScreen: Xác thực mã OTP.

RegisterScreen: Điền thông tin cá nhân (nếu là user mới).

MainNavigator (Dành cho người dùng đã đăng nhập):

MainTab (Bottom Tab Navigator):

HomeMapScreen: Đây chính là màn hình chứa MapBackground (đặt xe, chọn điểm đón/đến).

ActivityScreen: Lịch sử các chuyến đi.

ProfileScreen: Cài đặt, thông tin tài khoản, ví thanh toán.

BookingFlowStack (Các màn hình modal hoặc push đè lên tab chính khi đang thao tác):

SearchLocationScreen: Màn hình gõ địa chỉ, autocomplete.

TrackingTripScreen: Màn hình theo dõi tài xế đang tới/đang trong chuyến.

Đề xuất hành động tiếp theo
Dựa trên kế hoạch và tình trạng hiện tại, tôi đề xuất bạn nên bắt đầu bằng việc Tạo mới Customer App trước.

Bước 1: Cài đặt @react-navigation và dựng khung kiến trúc Navigation (AuthStack + MainTab) cho Customer App.

Bước 2: Đưa MapBackground vào HomeMapScreen của Customer App để test luồng cấp quyền GPS và render bản đồ trước.

Bước 3: Sau khi Customer App chạy mượt mà, dùng kinh nghiệm đó quay lại refactor, gỡ bỏ react-native-maps bên phía Driver App.
3. chỉ triển khai driver-app

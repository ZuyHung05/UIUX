# 📱 Serena Health - Mobile Application (Patient Role)

Đây là phân hệ **Mobile Application** dành cho role **Người cần tư vấn (Bệnh nhân)** trong hệ thống hỗ trợ y tế **Serena Health**. Dự án được phát triển bằng công nghệ **React Native (Expo)** kết hợp với **TypeScript**.

---

## 🗺️ Kiến trúc chức năng (Sitemap)

Ứng dụng sử dụng cấu trúc điều hướng **Bottom Navigation (4 Tab)** chuẩn di động, bao gồm các phân cấp màn hình sau:

- **Tab 1: Trang chủ & Tra cứu**
  - `1.1 Dashboard Trang chủ` (Xem phím tắt triệu chứng nhanh, thông báo lịch hẹn)
  - `1.2 Tính năng Tra cứu nhanh` (Tra cứu thông tin thuốc, tra cứu bệnh lý)
- **Tab 2: Chat tư vấn & Sàng lọc**
  - `2.1 Giao diện Chatbot AI` (Tư vấn lối sống, chạy luồng trắc nghiệm sàng lọc triệu chứng, hiển thị thẻ kết quả)
  - `2.2 Kết nối chuyên gia` (Danh sách Bác sĩ trực tuyến, Khung Chat/Call với Bác sĩ, Bottom Sheet đánh giá chất lượng)
- **Tab 3: Lịch hẹn & Lịch sử hoạt động**
  - `3.1 Lịch sử hoạt động (Segmented Control)`
    - _Sub-tab Tư vấn_: Xem lại log chat cũ với AI hoặc Bác sĩ.
    - _Sub-tab Khám trực tiếp_: Xem lại các ca khám tại phòng khám (Trạng thái Hoàn thành/Đã hủy).
  - `3.2 Đặt lịch khám trực tiếp` (Tìm bác sĩ -> Bật Bottom Sheet chọn Ngày/Giờ -> Sinh mã QR Check-in)
- **Tab 4: Cá nhân & Sức khỏe**
  - `4.1 Thông tin tài khoản` (Chỉnh sửa thông tin cá nhân)
  - `4.2 Hồ sơ sức khỏe điện tử (EMR)` (Thông số sinh trắc, Thẻ cảnh báo dị ứng, Kho lưu trữ ảnh đơn thuốc/xét nghiệm)

---

## 📂 Cấu trúc thư mục mã nguồn (`/src`)

Thư mục nguồn được tổ chức tách biệt để tránh chồng lấn và dễ phân chia công việc:

```text
src/
├── assets/          # Hình ảnh, biểu tượng (Logo Serena, Icons)
├── components/      # Các UI Component dùng chung (CustomButton, Header, SpecialtyCard...)
├── navigation/      # Cấu hình luồng đi (BottomTabNavigator.tsx, AppNavigator.tsx)
├── screens/         # Giao diện các màn hình chính
│   ├── Home/        # Màn hình Trang chủ & Tra cứu nhanh
│   ├── Chat/        # Khung chat AI, Danh sách bác sĩ & Giao diện tư vấn
│   ├── History/     # Lịch sử hoạt động (Tư vấn & Khám trực tiếp)
│   └── Profile/     # Hồ sơ cá nhân & Thông số sức khỏe (EMR)
├── services/        # Quản lý dữ liệu giả lập (Mock Data / Mock API)
└── utils/           # Các hàm bổ trợ (Format ngày tháng, validate dữ liệu)
```

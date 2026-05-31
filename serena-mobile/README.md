# 📱 Serena Health Mobile App (Patient Role)

Ứng dụng di động dành cho **Người cần tư vấn (Bệnh nhân)** trong hệ thống hỗ trợ y tế **Serena Health**.

Dự án được phát triển bằng **React Native (Expo)** và **TypeScript**, tập trung vào các chức năng tư vấn sức khỏe, đặt lịch khám và quản lý hồ sơ sức khỏe cá nhân.

---

# 🗺️ Chức năng chính

Ứng dụng sử dụng **Bottom Navigation (4 Tabs)**:

## 1. Trang chủ & Tra cứu

- Dashboard tổng quan
- Hiển thị thông báo và lịch hẹn
- Tra cứu thuốc
- Tra cứu bệnh lý

## 2. Chat tư vấn & Sàng lọc

- Chatbot AI hỗ trợ tư vấn sức khỏe
- Trắc nghiệm sàng lọc triệu chứng
- Hiển thị kết quả đánh giá
- Kết nối bác sĩ trực tuyến
- Chat/Call với bác sĩ
- Đánh giá chất lượng tư vấn

## 3. Lịch hẹn & Lịch sử hoạt động

### Lịch sử hoạt động

- Xem lại lịch sử chat với AI hoặc bác sĩ
- Xem lịch sử khám trực tiếp
- Theo dõi trạng thái cuộc hẹn

### Đặt lịch khám

- Tìm kiếm bác sĩ
- Chọn ngày và giờ khám
- Sinh mã QR Check-in

## 4. Cá nhân & Sức khỏe

- Quản lý thông tin tài khoản
- Hồ sơ sức khỏe điện tử (EMR)
- Theo dõi chỉ số sức khỏe
- Quản lý dị ứng và tiền sử bệnh
- Lưu trữ đơn thuốc và kết quả xét nghiệm

---

# 🚀 Công nghệ sử dụng

| Công nghệ                      | Mục đích                      |
| ------------------------------ | ----------------------------- |
| React Native (Expo)            | Framework phát triển ứng dụng |
| TypeScript                     | Kiểm soát kiểu dữ liệu        |
| React Navigation               | Điều hướng màn hình           |
| Lucide React Native            | Hệ thống Icon                 |
| React Native Safe Area Context | Hỗ trợ Safe Area              |
| Flexbox                        | Xây dựng giao diện            |
| Expo Router / Expo SDK         | Quản lý runtime và build      |

---

# 📂 Cấu trúc thư mục

```text
src/
├── assets/
│   └── Hình ảnh, icon và tài nguyên tĩnh
│
├── components/
│   ├── common/
│   │   └── AppButton, SearchBar, RatingModal...
│   ├── layout/
│   │   └── MainLayout, AppHeader...
│   └── history/
│       └── Component cho màn hình lịch sử
│
├── navigation/
│   └── Cấu hình Bottom Tab và Navigation
│
├── screens/
│   ├── Home/
│   ├── Chat/
│   ├── History/
│   └── Profile/
│
├── services/
│   └── Mock Data / Mock API
│
└── utils/
    └── Theme, helper functions, validation...
```

---

# 🛠️ Cài đặt và chạy ứng dụng

## Yêu cầu hệ thống

- Node.js (LTS Version)
- Expo Go trên Android hoặc iOS

## Cài đặt

Di chuyển vào thư mục serena-mobile

```bash
cd serena-mobile
```

```bash
npm install
```

## Chạy ứng dụng

```bash
npx expo start
```

Sau khi khởi động:
Để xem trên điện thoại, tải ứng dụng Expo go

- Android: Quét QR bằng Expo Go
- iOS: Quét QR bằng Camera và chọn mở trong Expo go

Nếu gặp lỗi kết nối mạng:

```bash
npx expo start --tunnel
```

## Lựa chọn xem ngay trên web thì sau khi app khởi động, nhấn w sẽ tự động mở bằng browser

# 🎨 Coding Standards

## 1. Sử dụng Theme chung

Không hard-code màu sắc hoặc typography trong component.

```tsx
import { COLORS, TYPOGRAPHY } from "../../utils/theme";

<Text
  style={{
    color: COLORS.secondary,
    ...TYPOGRAPHY.title,
  }}
>
  Tiêu đề
</Text>;
```

---

## 2. Sử dụng MainLayout

Mọi màn hình nên được bao bọc bởi `MainLayout` để đảm bảo:

- Safe Area
- Header thống nhất
- Padding đồng nhất

```tsx
<MainLayout title="Tên màn hình" subtitle="Mô tả ngắn">
  {/* Content */}
</MainLayout>
```

---

## 3. Sử dụng AppButton

Ưu tiên dùng `AppButton` thay cho `TouchableOpacity`.

Các variant hiện có:

| Variant | Mục đích           |
| ------- | ------------------ |
| primary | Hành động chính    |
| outline | Nút viền           |
| ghost   | Nút phụ            |
| danger  | Hành động cảnh báo |

Ví dụ:

```tsx
<AppButton title="Đặt lịch" variant="primary" onPress={handleBooking} />
```

---

# ⚠️ Lưu ý khi phát triển

### Reload ứng dụng

Nếu thay đổi giao diện nhưng không thấy cập nhật:

```bash
r
```

trong terminal Expo để reload.

### Quản lý Modal

Đối với các Modal hoặc Bottom Sheet:

- State đóng/mở nên được quản lý ở màn hình cha.
- Tránh đặt logic điều khiển bên trong component con.
- Giúp tái sử dụng component và tối ưu hiệu năng.

---

# 👥 Nhóm phát triển

Serena Health Team

Dự án được xây dựng phục vụ môn học UI/UX và phát triển ứng dụng di động trong lĩnh vực chăm sóc sức khỏe.

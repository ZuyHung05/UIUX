# Serene Health - Multiplatform Workspace

Chào mừng bạn đến với kho lưu trữ chính thức của **Serene Health** - Hệ thống trợ lý y tế thông minh và quản lý phòng khám toàn diện.

Repository này được tái cấu trúc thành không gian làm việc đa nền tảng (Multi-platform Workspace) để hỗ trợ song song các dự án ứng dụng web và ứng dụng di động.

---

## 📂 Cấu trúc thư mục (Repository Architecture)

```text
/ (Thư mục gốc)
├── serena-web/          # Toàn bộ mã nguồn hệ thống Web (Vite + React + TypeScript)
│   ├── apps/
│   │   ├── web/         # Client frontend dành cho Bác sĩ và Quản lý phòng khám
│   │   └── api/         # Backend API phục vụ chatbot và tích hợp hệ thống
│   ├── docs/            # Tài liệu thiết kế hệ thống, kiến trúc và UX
│   ├── package.json     # Quản lý thư viện và scripts toàn hệ thống Web
│   └── ...
│
├── serena-mobile/       # Không gian phát triển ứng dụng di động (Mobile App)
│   └── .gitkeep
│
├── .gitignore           # File loại trừ Git toàn cục ở thư mục gốc
└── README.md            # Tài liệu hướng dẫn cấu trúc dự án chính này
```

---

## 💻 Hướng dẫn phát triển Web (`serena-web`)

Thành phần Web hiện tại là một monorepo quản lý song song ứng dụng Web Portal (apps/web) và API Services (apps/api).

### 🚀 Khởi chạy nhanh (Quick Start)

1. **Di chuyển vào thư mục Web:**
   ```bash
   cd serena-web
   ```

2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```

3. **Khởi chạy ứng dụng môi trường nhà phát triển (Development):**
   * Chạy riêng ứng dụng Web Portal:
     ```bash
     npm run dev:web
     ```
   * Chạy riêng ứng dụng API Backend:
     ```bash
     npm run dev:api
     ```

4. **Biên dịch ứng dụng (Production Build):**
   ```bash
   npm run build:web
   ```

---

## 📱 Định hướng phát triển ứng dụng di động (`serena-mobile`)

Thư mục `serena-mobile/` được thiết lập sẵn để sẵn sàng cho quá trình phát triển ứng dụng di động (dự kiến sử dụng React Native hoặc Flutter) phục vụ trực tiếp cho người bệnh/khách hàng. 

Tài liệu hướng dẫn khởi tạo dự án di động sẽ được cập nhật chi tiết ngay khi dự án bắt đầu triển khai phase tiếp theo.

---

## 🛠️ Tiêu chuẩn phát triển (Development Standards)

* **Git Workflow:** Vui lòng tạo branch mới từ nhánh `main` cho từng tính năng và gửi Pull Request để kiểm duyệt.
* **Mã hóa màu sắc & UI:** Đảm bảo tuân thủ nghiêm ngặt các quy tắc thiết kế Premium và bảng mã màu trong tài liệu thiết kế UX/UI.

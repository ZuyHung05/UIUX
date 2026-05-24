# Family Clinic Chatbot

Hệ thống chatbot hỗ trợ chuỗi phòng khám gia đình. Chatbot giúp người dùng khảo sát
tình trạng sức khỏe ban đầu, nhận định hướng xử lý, chuyển ca sang bác sĩ khi cần và
hỗ trợ đặt lịch khám.

> Chatbot chỉ hỗ trợ tư vấn ban đầu. Hệ thống không kê đơn thuốc và không thay thế chẩn đoán của bác sĩ.

## Kiến trúc project

Project dùng cấu trúc monorepo để tách rõ frontend và backend:

```txt
UIUX/
  apps/
    web/      # Frontend React + Vite
    api/      # Backend NestJS + TypeScript skeleton

  docs/
    ARCHITECTURE.md
    SYSTEM_OVERVIEW.md
    RUN_GUIDE.md
    NAMING_CONVENTIONS.md

  package.json
  README.md
```

## Công nghệ

Frontend:

- React
- Vite
- ESLint
- Prettier

Backend:

- NestJS
- TypeScript
- PostgreSQL sau này cho database
- Prisma sau này cho ORM
- WebSocket hoặc Socket.IO sau này cho realtime chat

## Cấu trúc frontend

```txt
apps/web/
  public/
  src/
    app/
    assets/
    components/
    layouts/
    pages/
      mobile-user/
      doctor/
      clinic-manager/
      expert/
    styles/
    types/
```

Role Người dùng được triển khai theo giao diện mobile-first trong cùng app web. Các role
Bác sĩ, Chuyên gia và Quản lý phòng khám dùng dashboard desktop trong cùng frontend.

## Cấu trúc backend

```txt
apps/api/
  src/
    modules/
    shared/
  package.json
  tsconfig.json
```

Giai đoạn hiện tại chỉ có skeleton backend. Chưa triển khai controller, service, database
schema hoặc API thật.

## Clone project

```bash
git clone <repository-url>
cd UIUX
```

## Cài đặt môi trường

Yêu cầu:

- Node.js
- npm

Kiểm tra:

```bash
node -v
npm -v
```

Cài dependencies cho frontend hiện tại:

```bash
cd apps/web
npm install
```

Backend mới chỉ có cấu hình skeleton. Khi bắt đầu triển khai backend thật, cài dependencies:

```bash
cd apps/api
npm install
```

## Chạy hệ thống

Chạy frontend:

```bash
cd apps/web
npm run dev
```

Hoặc chạy từ root bằng workspace script:

```bash
npm run dev:web
```

Build frontend:

```bash
npm run build:web
```

Lint frontend:

```bash
npm run lint:web
```

Các script backend đã được khai báo sẵn ở root:

```bash
npm run dev:api
npm run build:api
npm run lint:api
```

Các lệnh backend chỉ chạy được sau khi cài dependencies trong `apps/api` và bắt đầu triển khai code backend.

## Tài liệu

- [Kiến trúc hệ thống](docs/ARCHITECTURE.md)
- [Giới thiệu hệ thống](docs/SYSTEM_OVERVIEW.md)
- [Hướng dẫn chạy hệ thống](docs/RUN_GUIDE.md)
- [Quy ước đặt tên nhóm](docs/NAMING_CONVENTIONS.md)

## Trạng thái hiện tại

- Đã tách frontend và backend ở mức folder.
- Frontend hiện là app React + Vite.
- Backend mới là NestJS + TypeScript skeleton.
- Chưa triển khai UI thật, routing, mock data, API, database hoặc logic chatbot.


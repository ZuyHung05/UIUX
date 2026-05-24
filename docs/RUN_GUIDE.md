# Hướng dẫn chạy hệ thống

## Yêu cầu môi trường

- Node.js
- npm

## Cài đặt frontend

```bash
cd apps/web
npm install
```

## Chạy frontend

```bash
npm run dev
```

Hoặc chạy từ root:

```bash
npm run dev:web
```

## Build frontend

```bash
npm run build:web
```

## Lint frontend

```bash
npm run lint:web
```

## Backend

Backend nằm trong `apps/api` và dùng NestJS + TypeScript theo định hướng triển khai.
Giai đoạn hiện tại mới có skeleton và cấu hình tối thiểu, chưa có API thật.

Khi bắt đầu triển khai backend:

```bash
cd apps/api
npm install
npm run dev
```


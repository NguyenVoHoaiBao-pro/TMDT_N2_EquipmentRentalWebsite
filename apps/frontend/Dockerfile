FROM node:20-alpine

WORKDIR /app

# Copy các file quản lý thư viện trước
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Cài đặt dependencies (Docker sẽ cache bước này)
RUN npm ci

# Copy toàn bộ code (Bị ghi đè bởi volumes trong compose khi chạy, nhưng vẫn cần để khởi tạo)
COPY . .

EXPOSE 5173

# Lệnh chạy chế độ Dev để có Hot-Reload
CMD ["npm", "run", "dev", "--workspace=apps/frontend", "--", "--host", "0.0.0.0"]

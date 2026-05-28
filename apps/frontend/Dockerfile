# Stage 1: Build the static files
FROM node:20-alpine AS builder
WORKDIR /build
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm ci
COPY apps/frontend/ ./apps/frontend/
RUN npm run build --workspace=apps/frontend

# Stage 2: Serve file using Nginx
FROM nginx:1.25-alpine
COPY --from=builder /build/apps/frontend/dist /usr/share/nginx/html
# Open port 80 for serving the application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

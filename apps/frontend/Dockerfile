# Stage 1: Build the static files
FROM node:20-alpine3.21 AS builder
WORKDIR /build
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm ci
COPY apps/frontend/ ./apps/frontend/
RUN npm run build --workspace=apps/frontend

# Stage 2: Serve file using Nginx
FROM nginx:alpine3.21

# Copy static file to nginx default config:
COPY --from=builder /build/apps/frontend/dist /usr/share/nginx/html

# Override default config of nginx built in:
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Open port 80 for serving the application
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

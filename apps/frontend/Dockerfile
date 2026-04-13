# Build stage
FROM node:20-alpine AS builder

WORKDIR /build

# Copy monorepo structure
COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/

# Install all workspace dependencies
RUN npm ci

# Copy frontend source
COPY apps/frontend/ ./apps/frontend/

# Build frontend workspace
RUN npm run build --workspace=apps/frontend

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve to run the production build
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /build/dist ./dist

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["serve", "-s", "dist", "-l", "3000"]

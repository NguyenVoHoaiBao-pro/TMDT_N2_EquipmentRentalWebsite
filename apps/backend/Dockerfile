# Multi-stage build for Backend
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy pom.xml from app/backend
COPY apps/backend/pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY apps/backend/src ./src

# Build application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy JAR from builder
COPY --from=builder /build/target/backend-*.jar app.jar

# Create non-root user
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/equipment_rental/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]

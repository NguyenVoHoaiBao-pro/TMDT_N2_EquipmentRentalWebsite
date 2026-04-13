# Equipment Rental Backend - Spring Boot API

Spring Boot 4.0.5 application with JWT Authentication, Role-Based Access Control (RBAC), and Swagger UI documentation for the Equipment Rental System.

## 🚀 Features

- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Role-Based Authorization** - ADMIN, USER, GUEST roles
- ✅ **Spring Security** - Stateless API with BCrypt password encoding
- ✅ **Swagger UI** - Interactive API documentation with Bearer token support
- ✅ **MySQL Database** - JPA/Hibernate ORM
- ✅ **Environment Configuration** - .env file support via spring-dotenv
- ✅ **Logging** - SLF4J with configurable levels
- ✅ **MapStruct** - Ready for DTO entity mapping

## 📋 Prerequisites

- **Java 21+**
- **Maven 3.8+**
- **MySQL 8.0+** (or H2 in-memory for testing)

## 🛠️ Quick Setup

### 1. Clone & Install Dependencies

```bash
cd apps/backend
mvn clean install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# JWT Configuration
JWT_SECRET=YourSuperSecretKeyMin32CharsLongPassword1234567890
JWT_EXPIRATION_MS=86400000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=equipment_rental_db
DB_USER=root
DB_PASSWORD=root

# Server
SERVER_PORT=8080
```

### 3. Create Database (MySQL only)

```bash
mysql -u root -p
> CREATE DATABASE demo_db;
> EXIT;
```

### 4. Build & Run

```bash
# Build
mvn clean package

# Run JAR
java -jar target/demo-0.0.1-SNAPSHOT.jar

# Or run from IDE (Dev mode with hot-reload)
mvn spring-boot:run
```

Server starts at: <http://localhost:8080>

---

## 📖 API Documentation

Swagger UI: <http://localhost:8080/swagger-ui.html>

### Authentication Endpoints

#### 1. Register New User

```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "john@example.com",
  "password": "SecurePass@123"
}
```

Response:

```json
{
  "message": "User registered successfully"
}
```

#### 2. Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "john@example.com",
  "password": "SecurePass@123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "username": "john@example.com",
  "role": "USER"
}
```

#### 3. Access Protected Endpoints

Include JWT token in Authorization header:

```bash
GET http://localhost:8080/api/protected/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔐 Using Swagger UI with JWT

1. Open <http://localhost:8080/swagger-ui.html>
2. Click "Authorize" button (top-right)
3. Paste your JWT token (without "Bearer " prefix):

   ```text
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Click "Authorize"
5. Now all requests include the Authorization header automatically

---

## 📁 Project Structure

```text
demo/
├── src/main/java/com/example/demo/
│   ├── config/
│   │   ├── SecurityConfig.java         # Spring Security configuration
│   │   └── OpenApiConfig.java          # Swagger/OpenAPI configuration
│   ├── controller/
│   │   └── AuthController.java         # Authentication endpoints
│   ├── security/
│   │   ├── JwtTokenProvider.java       # JWT token operations
│   │   ├── CustomUserDetails.java      # Spring Security user wrapper
│   │   ├── CustomUserDetailsService.java
│   │   └── JwtAuthenticationFilter.java # Bearer token extraction
│   ├── entity/
│   │   ├── User.java                   # JPA User entity
│   │   └── Role.java                   # RBAC role enum
│   ├── repository/
│   │   └── UserRepository.java         # Database queries
│   ├── dto/
│   │   ├── LoginRequest.java           # Request DTO
│   │   └── JwtResponse.java            # Response DTO
│   └── DemoApplication.java            # Spring Boot entry point
├── src/main/resources/
│   └── application.yaml                # Spring Boot configuration
├── .env                                # Environment variables (local use)
├── .env.example                        # Template for team
├── .gitignore                          # Git ignore rules
├── pom.xml                             # Maven dependencies
└── README.md                           # This file
```

---

## 🔒 Security Features

### Password Encoding

- **Algorithm**: BCrypt
- **Rounds**: Default (12)

### JWT Token

- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 24 hours (configurable)
- **Claims**: username, role, email

### Authorization

- **Stateless**: No session storage (API-first design)
- **Bearer Token**: HTTP Authorization header
- **Role-Based**: ADMIN, USER, GUEST
- **Method-Level**: Supports `@Secured`, `@PreAuthorize`

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role ENUM('ADMIN', 'USER', 'GUEST') NOT NULL,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🧪 Testing

### Unit Tests (with Maven)

```bash
mvn test
```

### Manual Testing (with cURL)

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password@123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Password@123"}' | jq '.token'

# Access with token
TOKEN="<your-jwt-token>"
curl http://localhost:8080/api/protected/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Postman Collection

(To be added - can be generated from Swagger UI)

---

## 🔧 Configuration

### Environment Variables (.env)

```env
# JWT
JWT_SECRET=MinimumOf32CharactersForHS256SecurityKey123
JWT_EXPIRATION_MS=86400000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=demo_db
DB_USER=root
DB_PASSWORD=root

# Server
SERVER_PORT=8080

# Logging
LOG_LEVEL=INFO
APP_LOG_LEVEL=DEBUG
```

### Spring Properties

- **JPA Auto-Update**: `ddl-auto: update` (creates/updates tables)
- **Hibernate Dialect**: `MySQL8Dialect`
- **Session Management**: `STATELESS` (no cookies)
- **CSRF**: Disabled (stateless API)

---

## 🐛 Troubleshooting

### "Database connection refused"

- Check MySQL is running: `mysql -u root -p`
- Verify `.env` database credentials
- Create database: `mysql -u root -p -e "CREATE DATABASE demo_db;"`

### "JWT token expired"

- Default expiration: 24 hours
- Adjust `JWT_EXPIRATION_MS` in `.env`

### "Invalid token"

- Ensure token is in `Authorization: Bearer <token>` format
- Verify `JWT_SECRET` matches in `.env`

### Swagger UI not loading

- Check: <http://localhost:8080/swagger-ui.html>
- Verify `springdoc` dependency in `pom.xml`
- Check logs for errors

---

## 📦 Dependencies

| Dependency        | Version | Purpose         |
| ----------------- | ------- | --------------- |
| Spring Boot       | 4.0.5   | Framework       |
| Spring Security   | Latest  | Authentication  |
| JJWT              | 0.13.0  | JWT tokens      |
| MySQL Connector   | Latest  | Database        |
| Lombok            | Latest  | Code generation |
| MapStruct         | 1.6.3   | DTO mapping     |
| SpringDoc OpenAPI | 3.0.2   | Swagger UI      |
| Spring Dotenv     | 5.1.0   | .env support    |

---

## 🚀 Deployment

### Docker

```dockerfile
FROM openjdk:21-slim
WORKDIR /app
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
ENV JWT_SECRET=prod-secret-key-here
ENV DB_HOST=db.example.com
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Build & Run

```bash
docker build -t demo-api:latest .
docker run -e JWT_SECRET=prod-key -e DB_HOST=db-host -p 8080:8080 demo-api:latest
```

---

## 📝 Future Enhancements

- [ ] Email verification flow
- [ ] Password reset endpoint
- [ ] Refresh token rotation
- [ ] Rate limiting
- [ ] API versioning
- [ ] Audit logging
- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration

---

## 📞 Support

For issues or questions:

1. Check Swagger documentation: <http://localhost:8080/swagger-ui.html>
2. Review logs in console
3. Check `.env` configuration

---

## 📄 License

Apache License 2.0 - See LICENSE file

---

**Last Updated**: April 13, 2026
**Version**: 1.0.0

# 🏢 Equipment Rental E-Commerce Website - Monorepo

A modern full-stack e-commerce platform for equipment rental with a microservices-ready architecture.

## 📋 Project Structure

```bash
.
├── apps/
│   ├── backend/                    # Java/Spring Boot Backend API
│   │   └── demo/
│   │       ├── src/
│   │       ├── pom.xml            # Maven configuration
│   │       ├── Dockerfile         # Backend Docker image
│   │       └── README.md
│   │
│   └── frontend/                   # React + TypeScript + Vite Frontend
│       ├── src/
│       ├── package.json           # npm dependencies
│       ├── vite.config.ts         # Vite configuration with API proxy
│       ├── Dockerfile            # Frontend Docker image
│       └── README.md
│
├── .github/
│   └── workflows/
│       ├── ci.yml               # CI/CD pipeline (tests, builds)
│       └── docker-build.yml     # Docker image build & push
│
├── docker-compose.yml           # Local development environment
├── lerna.json                   # Monorepo workspace configuration
├── package.json                 # Root workspace package.json
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **Java** 21+
- **Maven** 3.8+
- **Docker** & **Docker Compose** (optional)
- **MySQL** 8.0+ (or use Docker Compose)

### Option 1: Local Development (Recommended)

#### 1. Install Dependencies

```bash
# Install root dependencies and all workspace packages
npm run install:all

# Or manually:
npm install
npm install --workspaces
```

#### 2. Configure Environment

Create `.env` in `apps/backend/demo/`:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=demo_db
DB_USER=root
DB_PASSWORD=root

# JWT
JWT_SECRET=YourSuperSecretKeyMin32CharsLongPassword1234567890
JWT_EXPIRATION_MS=86400000

# Server
SERVER_PORT=8080
LOG_LEVEL=INFO
```

#### 3. Create Database (MySQL)

```bash
mysql -u root -p
> CREATE DATABASE demo_db;
> EXIT;
```

#### 4. Run Development Servers

**Terminal 1 - Backend:**

```bash
npm run dev --workspace=backend-api
# Or from apps/backend/demo:
./mvnw spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
npm run dev --workspace=frontend
# Or from apps/frontend:
npm run dev
```

- Backend: [`http://localhost:8080`](http://localhost:8080) (Swagger UI: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html))
- Frontend: [`http://localhost:5173`](http://localhost:5173)
- Frontend proxies /api → Backend automatically

---

### Option 2: Docker Compose (All-in-One)

```bash
# Start all services (MySQL, Redis, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Clean up volumes
docker-compose down -v
```

Services will be available at:

- Frontend: [`http://localhost:3000`](http://localhost:3000)
- Backend: [`http://localhost:8080`](http://localhost:8080)
- MySQL: `localhost:3306`
- Redis: `localhost:6379`
- Swagger UI: [`http://localhost:8080/swagger-ui.html`](http://localhost:8080/swagger-ui.html)

---

## 📦 Available Commands

### Root Level (All Workspaces)

```bash
npm run dev          # Start all dev servers in watch mode
npm run build        # Build all packages (backend JAR + frontend dist)
npm run lint         # Lint all packages
npm run test         # Run tests in all packages
npm run test:ci      # Run tests with CI output
npm run clean        # Clean all build artifacts and node_modules
npm run install:all  # Install dependencies across all workspaces
```

### Backend Only

```bash
cd apps/backend

npm run dev          # mvnw spring-boot:run
npm run build        # mvnw clean package (skip tests)
npm run build:docker # Build Docker image
npm run test         # mvnw clean test
npm run test:ci      # mvnw clean test -B (CI mode)
npm run install      # mvnw clean install
npm run clean        # mvnw clean
```

### Frontend Only

```bash
cd apps/frontend

npm run dev          # vite dev server
npm run build        # TypeScript compile + vite build
npm run build:preview # Build and preview
npm run lint         # eslint
npm run lint:fix     # eslint --fix
npm run preview      # vite preview
npm run clean        # Remove dist and node_modules
```

---

## 🏗️ Architecture

### Backend (Spring Boot)

- **Port:** 8080
- **Authentication:** JWT with Role-Based Access Control (RBAC)
- **Database:** MySQL 8.0+ with JPA/Hibernate
- **Cache:** Redis for session/token caching
- **API Documentation:** Swagger UI + OpenAPI
- **Features:**
  - User registration & login
  - Role-based authorization (ADMIN, USER, GUEST)
  - Equipment rental management
  - Order management
  - Cloudinary image upload
  - Email notifications

### Frontend (React + Vite)

- **Port:** 3000 (Docker) / 5173 (Dev)
- **Language:** TypeScript
- **Build Tool:** Vite (fast bundling)
- **Features:**
  - Equipment catalog
  - Shopping cart
  - User authentication UI
  - Admin dashboard
  - Responsive design

---

## 🔄 CI/CD Pipeline

### Workflows

#### 1. **ci.yml** - Continuous Integration

- Triggers on: push to `main`/`develop`, pull requests
- Jobs:
  - Backend: Maven build & unit tests
  - Frontend: npm build & ESLint
  - Integration: Artifact verification
- Uploads test reports & build artifacts

#### 2. **docker-build.yml** - Docker Image Build

- Triggers on: push to `main`, tags (v\*)
- Builds & pushes multi-stage Docker images to GHCR
- Requires GitHub token for registry authentication

### Local CI Testing

```bash
# Run all tests locally
npm run test:ci

# Build everything
npm run build

# Check linting
npm run lint
```

---

## 📥 Code Quality & Linting

### Frontend Linting

```bash
npm run lint         # Check code
npm run lint:fix     # Auto-fix
```

### Backend Testing

```bash
npm run test         # Run all tests
npm run test:ci      # CI mode with detailed output
```

---

## 🐳 Docker

### Build Manually

```bash
# Backend
cd apps/backend/demo
docker build -t equipment-rental-backend:latest .

# Frontend
cd apps/frontend
docker build -t equipment-rental-frontend:latest .
```

### Docker Compose Services

- **MySQL 8.0** - Equipment rental database
- **Redis 7** - Cache & session store
- **Backend** - Spring Boot API
- **Frontend** - React application

All services are networked and configured with health checks.

---

## 🔐 Security

### Environment Variables (Never commit .env)

- `JWT_SECRET` - Minimum 32 characters
- `DB_PASSWORD` - Strong database password
- `API_KEY` - For third-party services

### Best Practices

1. Use strong JWT secret (32+ characters)
2. Never commit `.env` files
3. Use HTTPS in production
4. Rotate JWT tokens regularly
5. Implement rate limiting

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Frontend (5173/3000)
lsof -i :5173
kill -9 <PID>
```

### Maven/Java Issues

```bash
# Verify Maven
mvn --version

# Verify Java
java -version

# Use wrapper (no Maven install needed)
cd apps/backend/demo
./mvnw clean install
```

### NPM Issues

```bash
# Clear cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation

- [Backend README](apps/backend/demo/README.md) - Setup & API endpoints
- [Frontend README](apps/frontend/README.md) - Frontend setup & components

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Commit with meaningful messages (Conventional Commits)
4. Push and create a Pull Request
5. CI/CD pipeline will validate automatically

---

## 📄 License

MIT License - feel free to use for your projects!

---

## 📞 Support

For issues and questions:

- Create an issue in GitHub
- Check existing documentation
- Review CI/CD logs for build failures

---

## 🎉 Get Started

Happy coding! 🚀

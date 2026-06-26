# 🏢 Equipment Rental E-Commerce Website - Monorepo

A modern full-stack e-commerce platform for equipment rental with a microservices-ready architecture.

**Version:** 1.0.0 | **Status:** 🚀 Active Development | **Last Updated:** June 2026

Built with **Spring Boot** (Java 21) for the backend and **React + TypeScript + Vite** for a fast, responsive frontend.
Includes JWT authentication, role-based access control, MySQL database, Redis caching, Docker containerization, OAuth2 integration (Google & Facebook), real-time chat functionality, and comprehensive equipment management system.

## 📋 Project Structure

### Directory Layout

```bash
.
├── apps/
│   ├── backend/                    # ☕ Java/Spring Boot Backend API
│   │   ├── src/
│   │   │   ├── main/java/com/example/demo/
│   │   │   │   ├── config/              # Spring Security, OpenAPI configuration
│   │   │   │   ├── controller/          # REST API endpoints
│   │   │   │   ├── security/            # JWT authentication & authorization
│   │   │   │   ├── entity/              # JPA database entities
│   │   │   │   ├── repository/          # Database queries (Spring Data JPA)
│   │   │   │   ├── service/             # Business logic layer
│   │   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   └── util/                # Utility classes
│   │   │   └── resources/
│   │   │       ├── application.yaml     # Spring Boot configuration
│   │   │       └── database/            # SQL schema & seed scripts
│   │   ├── pom.xml                      # Maven dependencies & plugins
│   │   ├── Dockerfile-dev                   # Docker image for backend
│   │   ├── mvnw & mvnw.cmd             # Maven wrapper (no install needed)
│   │   └── README.md                    # Backend-specific documentation
│   │
│   └── frontend/                        # ⚛️ React + TypeScript + Vite Frontend
│       ├── src/
│       │   ├── components/              # Reusable React components
│       │   ├── pages/                   # Page-level components (auth, home, etc.)
│       │   ├── features/                # Feature modules (auth, cart, etc.)
│       │   ├── hooks/                   # Custom React hooks
│       │   ├── services/                # API service layer (axios)
│       │   ├── store/                   # State management (Zustand)
│       │   ├── providers/               # React providers (Query, Auth, etc.)
│       │   ├── lib/                     # Utility functions
│       │   ├── ui-primitives/           # Base UI components (shadcn/ui)
│       │   ├── assets/                  # Images, icons, fonts
│       │   ├── App.tsx                  # Root component
│       │   ├── main.tsx                 # Application entry point
│       │   └── index.css                # Global styles + Tailwind CSS
│       ├── public/                      # Static assets
│       ├── package.json                 # npm dependencies
│       ├── vite.config.ts              # Vite build configuration
│       ├── tsconfig.json               # TypeScript configuration
│       ├── tailwind.config.js          # Tailwind CSS configuration
│       ├── eslint.config.js            # ESLint rules
│       ├── Dockerfile-dev                   # Docker image for frontend
│       └── README.md                    # Frontend-specific documentation
│
├── .github/
│   └── workflows/
│       ├── ci.yml                      # Automated tests & build verification
│       └── docker-build.yml            # Docker image build & push to registry
│
├── docker-compose.yml                   # Complete local development environment
├── lerna.json                          # Lerna monorepo configuration
├── package.json                        # Root workspace & npm scripts
├── Makefile                            # Handy command shortcuts
└── README.md                           # This file
```

### Technology Stack

| Layer              | Technology                  | Purpose                        |
|--------------------|-----------------------------|--------------------------------|
| **Backend**        | Spring Boot 4.0.6, Java 21  | REST API, business logic       |
| **Authentication** | JWT (JJWT), Spring Security | Stateless API security         |
| **Database**       | MySQL 8.0, JPA/Hibernate    | Persistent data storage        |
| **Cache**          | Redis 7                     | Session & token caching        |
| **Frontend**       | React 19, TypeScript, Vite  | Modern UI framework            |
| **State**          | Zustand                     | Client-side state management   |
| **API Client**     | Axios, TanStack Query       | HTTP requests & caching        |
| **Styling**        | Tailwind CSS, shadcn/ui     | Responsive design              |
| **Deployment**     | Docker, Docker Compose      | Containerization               |
| **CI/CD**          | GitHub Actions              | Automated testing & deployment |

## 🎯 System Capabilities

### Backend Capabilities
- 🔧 RESTful API with 25+ endpoints
- 📊 Product & Equipment Management
- 🛒 Order Processing System
- 👥 User & Authentication Management
- 🏷️ Brand & Category Hierarchy
- 📅 Device Calendar Scheduling
- 💬 Real-time Chat WebSocket Server
- 📧 Email Notification Service
- 🖼️ Image Upload & Management (Cloudinary)
- 📝 Comprehensive API Documentation (Swagger)

### Frontend Capabilities
- 🎨 Responsive UI with Tailwind CSS
- 🔍 Advanced Product Search & Filtering
- 🛒 Shopping Cart Management
- 📅 Equipment Rental Booking
- 💬 Real-time Chat Support
- 👤 User Profile Management
- 📋 Order History & Tracking
- 🎯 Role-based UI Components
- 📱 Mobile-optimized Interface
- ⚡ Fast Performance (Vite build)

## 🚀 Quick Start

### Prerequisites

| Requirement        | Version | Required For                        | Alternative             |
|--------------------|---------|-------------------------------------|-------------------------|
| **Node.js**        | 20+     | Frontend build & npm scripts        | -                       |
| **Java**           | 21+     | Backend compilation & runtime       | -                       |
| **Maven**          | 3.8+    | Backend build (or use mvnw wrapper) | Use `./mvnw` (included) |
| **MySQL**          | 8.0+    | Database (dev)                      | Use Docker Compose      |
| **Docker**         | Latest  | Containerization                    | Optional for local dev  |
| **Docker Compose** | Latest  | Multi-service orchestration         | Optional for local dev  |

**Verify your installation:**

```bash
# Check Node.js
node --version   # Should be 20.x or higher
npm --version

# Check Java
java -version    # Should be 21+

# Check Maven
mvn --version    # Or use ./mvnw from the backend folder
```

### Option 1: Local Development (Recommended)

#### Step 1: Clone Repository & Install Dependencies

```bash
# Navigate to project directory
cd D:\Digital_Ecommerce\TMDT_N2_EquipmentRentalWebsite

# Install all dependencies (root + workspaces)
npm run install:all

# Or manually install:
npm install
npm install --workspaces
```

#### Step 2: Configure Environment Variables

Create `.env` file in `apps/backend/`:

```env
# ============= DATABASE CONFIGURATION =============
DB_HOST=localhost
DB_PORT=3306
DB_NAME=equipment_rental_db
DB_USER=root
DB_PASSWORD=root

# ============= JWT CONFIGURATION =============
JWT_SECRET=YourSuperSecretKeyMin32CharsLongPassword1234567890
JWT_EXPIRATION_MS=86400000

# ============= SERVER CONFIGURATION =============
SERVER_PORT=8080
LOG_LEVEL=INFO
APP_LOG_LEVEL=DEBUG

# ============= OAUTH2 (Google & Facebook) =============
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here

# ============= CLOUDINARY (Optional - For Image Upload) =============
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret

# ============= EMAIL (Optional - SMTP Configuration) =============
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

#### Step 3: Create MySQL Database

**Option A: Using MySQL CLI**

```bash
# Connect to MySQL
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE equipment_rental_db;
CREATE USER 'root'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON equipment_rental_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Option B: Using Docker (Recommended)**

Skip this step and use Docker Compose instead (see Option 2).

#### Step 4: Run Development Servers

**Terminal 1 - Start Backend:**

```bash
cd apps/backend

# Using Maven wrapper (recommended - no Maven install needed)
./mvnw spring-boot:run

# Or using npm script
npm run dev

# Or using Maven directly
mvn spring-boot:run
```

Backend will start at: **`http://localhost:8080`**

- REST API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- H2 Console (if enabled): `http://localhost:8080/h2-console`

**Terminal 2 - Start Frontend:**

```bash
cd apps/frontend

# Using npm script
npm run dev

# Or using Vite directly
npx vite
```

Frontend will start at: **`http://localhost:5173`**

**Access the Application:**

| Service         | URL                                                    | Purpose                     |
|-----------------|--------------------------------------------------------|-----------------------------|
| **Frontend**    | http://localhost:5173                                  | Main UI application         |
| **Backend API** | http://localhost:8080/api                              | REST API endpoints          |
| **Swagger UI**  | http://localhost:8080/equipment_rental/swagger-ui.html | API documentation & testing |
| **Database**    | localhost:3306                                         | MySQL connection            |

✅ Frontend automatically proxies `/api` requests to Backend (configured in `vite.config.ts`)

---

### Option 2: Docker Compose (All-in-One) ⚡ Recommended for Quick Setup

This method automatically sets up all services: MySQL, Redis, Backend, and Frontend in isolated containers.

#### Step 1: Configure Environment (Optional)

Create `.env` in project root for Docker Compose variables:

```env
# Database
DB_HOST=mysql
DB_PORT=3306
DB_NAME=equipment_rental_db
DB_USER=root
DB_PASSWORD=root

# JWT
JWT_SECRET=YourSuperSecretKeyMin32CharsLongPassword1234567890
JWT_EXPIRATION_MS=86400000

# OAuth2
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
FACEBOOK_CLIENT_ID=your_facebook_client_id_here
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret_here

# Server
SERVER_PORT=8080
```

#### Step 2: Start All Services

```bash
# Start all services in detached mode
docker-compose up -d

# View real-time logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

#### Step 3: Access Services

| Service         | URL                                                    | Port                              |
|-----------------|--------------------------------------------------------|-----------------------------------|
| **Frontend**    | http://localhost:80                                    | 80                                |
| **Backend API** | http://localhost:8080/api                              | 8080                              |
| **Swagger UI**  | http://localhost:8080/equipment_rental/swagger-ui.html | 8080                              |
| **MySQL**       | localhost                                              | 3306                              |
| **Redis**       | localhost                                              | 6379                              |

#### Step 4: Manage Services

```bash
# View running services status
docker-compose ps

# Stop all services (keep data)
docker-compose down

# Stop and remove all volumes (clean database)
docker-compose down -v

# Restart specific service
docker-compose restart backend

# View container logs with more context
docker-compose logs -f --tail=50 backend

# Execute command in container
docker-compose exec mysql mysql -u root -p demo_db

# Rebuild images (after code changes)
docker-compose build --no-cache
docker-compose up -d
```

#### Troubleshooting Docker Compose

```bash
# Check if ports are already in use
netstat -ano | findstr :5173
netstat -ano | findstr :8080

# Remove conflicting containers
docker-compose down
docker system prune -f

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d

# View container details
docker inspect equipment-rental-backend
```

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

### Backend (Spring Boot 4.0.6 - Java 21)

**Features:**

- ✅ **Port:** 8080
- ✅ **Authentication:** 
  - JWT (JSON Web Tokens) with HS256 algorithm
  - OAuth2 integration (Google & Facebook)
  - Session management with JWT tokens
- ✅ **Authorization:** Role-Based Access Control (RBAC)
  - ADMIN (Full system access)
  - USER (Regular customer access)
  - GUEST (Limited access)
- ✅ **Database:** MySQL 8.0+ with JPA/Hibernate ORM
- ✅ **Cache:** Redis 7 for session & token caching
- ✅ **API Documentation:** Swagger UI (OpenAPI 3.0) at `/equipment_rental/swagger-ui.html`
- ✅ **Password Security:** BCrypt encoding (12 rounds)
- ✅ **File Upload:** Cloudinary integration for product & device images
- ✅ **Email:** Spring Mail SMTP support for notifications
- ✅ **Real-time Communication:** WebSocket support with STOMP protocol
- ✅ **Logging:** SLF4J with customizable log levels
- ✅ **Configuration:** Environment variables via `.env` file

**Core Modules & Features:**

- ✅ **User Authentication** - JWT + OAuth2 (Google, Facebook) support
- ✅ **Role-Based Authorization** - ADMIN, USER, GUEST roles with fine-grained permissions
- ✅ **Equipment Rental Management** - Product catalog, inventory tracking, device calendar
- ✅ **Order & Transaction Processing** - Order creation, payment handling, order tracking
- ✅ **Real-time Chat System** - WebSocket-based customer support (STOMP/SockJS)
- ✅ **File Management** - Cloudinary integration for image uploads
- ✅ **Email Notifications** - SMTP-based email system
- ✅ **Brand & Category Management** - Hierarchical product organization
- ✅ **Search & Filtering** - Advanced product search with pagination

**Database Entities:**

- User, UserSocialAccount, Role (Authentication)
- Product, ProductImage, Brand, Category (Product Management)
- Device, DeviceImage, DeviceCalendar (Equipment Management)
- Order (Transaction)
- ChatRoom, ChatMessage (Communication)

**Dependencies Highlights:**

- **Spring Boot 4.0.6** → Web framework & app container
- **Spring Security** → Stateless API security with OAuth2
- **JJWT** → JWT token generation/validation
- **Spring Data JPA** → Database abstraction layer
- **MySQL 8.0 Connector** → Database driver
- **Redis** → Caching & session management
- **MapStruct** → DTO-Entity mapping
- **SpringDoc OpenAPI** → Swagger UI documentation
- **Cloudinary HTTP5** → Image upload & management
- **Spring Mail** → Email notifications
- **Lombok** → Code generation (reduce boilerplate)

### Frontend (React 19 - TypeScript - Vite)

**Features:**

- ✅ **Port:** 3000 (Docker) / 5173 (Development)
- ✅ **Language:** TypeScript for type safety
- ✅ **Build Tool:** Vite (ultra-fast bundling & HMR)
- ✅ **State Management:** Zustand (lightweight & flexible)
- ✅ **API Communication:** Axios + TanStack Query (React Query)
- ✅ **UI Framework:** React 19 with shadcn/ui components
- ✅ **Styling:** Tailwind CSS + CSS Modules
- ✅ **Routing:** React Router v7
- ✅ **Forms:** React Hook Form + Zod validation
- ✅ **Notifications:** Sonner (toast notifications)
- ✅ **Icons:** Lucide React
- ✅ **HTTP Proxy:** Vite proxy to backend API

**Core Pages & Features:**

- 🔐 **Authentication Pages** - Login, Register, Password Reset
- 🏠 **Home Page** - Landing page with featured products
- 🛒 **Product Catalog** - Equipment browse, search, filter, pagination
- 📦 **Device Registration** - Equipment rental booking & calendar management
- 💬 **Chat Feature** - Real-time customer support chat via WebSocket
- 👤 **User Profile** - Account management & rental history
- 📋 **Order Management** - Order history, order details, tracking
- ⚙️ **Admin Panel** - Equipment management dashboard (extensible)
- 📱 **Responsive Mobile-First Design** - Optimized for all devices

**Core Technologies:**

- React 19 with TypeScript
- React Router v7 (client-side routing)
- TanStack Query v5 (server state management)
- Zustand (client-side state)
- Axios + TanStack Query (HTTP + caching)
- React Hook Form + Zod (form handling & validation)
- Tailwind CSS + shadcn/ui (styling & components)
- Sonner (toast notifications)
- Lucide React (icons)
- STOMP/SockJS (WebSocket real-time chat)
- Vite (ultra-fast build tool)

**Dependencies Structure:**

```
Core: React 19, React DOM, React Router v7, TypeScript, Vite

State & Data:
  - Zustand (client state)
  - TanStack Query (server state)
  - Axios (HTTP client)

UI & Forms:
  - Tailwind CSS (styling)
  - shadcn/ui (component library)
  - React Hook Form (form handling)
  - Zod (schema validation)
  - Lucide React (icons)
  - Sonner (notifications)

Communication:
  - STOMP/SockJS (WebSocket)
```

---

## 💬 Real-time Chat System

The application features a WebSocket-based real-time chat system for customer support.

### Technology Stack:
- **Backend:** Spring WebSocket + STOMP protocol
- **Frontend:** SockJS + STOMP client
- **Database:** MySQL (chat persistence)

### Key Features:
- ✅ One-to-one customer support chat
- ✅ Message persistence with timestamps
- ✅ Online status tracking
- ✅ Chat room management
- ✅ Real-time notifications

### Usage:
The chat component is available in the **Chat Feature** section of the frontend at `/features/chat/`

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

## 🐋 Essential Docker Commands Reference

### 1️⃣ Project Management (Docker Compose)

Use these commands to control the entire system (MySQL, Redis, Backend, Frontend) at once.

```bash
# Start all services in background mode
docker-compose up -d

# Start all services and rebuild images if code changed
docker-compose up -d --build

# Pause all services (keeps data and configuration)
docker-compose stop

# Stop and remove all containers (frees RAM completely)
docker-compose down

# View real-time logs of entire system for debugging
docker-compose logs -f

# View logs of specific service
docker-compose logs -f backend       # Backend logs
docker-compose logs -f frontend      # Frontend logs
docker-compose logs -f mysql         # Database logs

# Check status of all running services
docker-compose ps

# Restart a specific service
docker-compose restart backend
docker-compose restart mysql

# Execute command inside a container
docker-compose exec mysql mysql -u root -p demo_db
docker-compose exec backend ls -la
```

### 2️⃣ Cleanup & Disk Space Management

Use these to keep your drive D from filling up over time.

```bash
# Check Docker disk usage (Images, Containers, Cache)
docker system df

# Remove all unused images, containers, and cache (POWERFUL - be careful!)
docker system prune -a --volumes

# Remove only build cache (frees many GB if you rebuild frequently)
docker builder prune

# Remove specific image by name/ID
docker rmi <image_name_or_id>

# Force remove a running container
docker rm -f <container_name_or_id>

# View disk usage breakdown
docker system df -v
```

### 3️⃣ Individual Container Management

Use these when you need to quickly run or check a single service.

```bash
# View list of running containers
docker ps

# View all containers (including stopped ones)
docker ps -a

# View all available images on your machine
docker images

# Force remove a running container
docker rm -f <container_name_or_id>

# Remove an image to free up space
docker rmi <image_name_or_id>

# View container logs (real-time)
docker logs -f <container_name_or_id>

# Get container details (IP, volumes, ports, etc.)
docker inspect <container_name_or_id>

# View container resource usage (CPU, Memory, Disk)
docker stats

# Copy file from container to host
docker cp <container_name>:/path/to/file ./local-path
```

### 4️⃣ System Management (WSL2 & Disk)

Use these for deep system intervention or troubleshooting.

```bash
# List all virtual distributions (check if Docker is running)
wsl -l -v

# Completely shutdown virtual environment (use when Docker freezes)
wsl --shutdown

# Export Docker data to backup
wsl --export <distro> <path/to/backup.tar>

# Import Docker data from backup or move to another drive
wsl --import <distro> <install_path> <backup.tar>

# Compact virtual disk to free space
wsl --manage <distro> --set-sparse true
```

### 💡 Pro Tips for Efficient Development

#### 1. Auto-cleanup after quick tests

```bash
# Add --rm flag to automatically remove container when stopped
docker run --rm -p 6379:6379 redis:7-alpine
# Container automatically deleted when you exit
```

#### 2. Check port usage before running

```bash
# Find out which app is using a port
netstat -ano | findstr :8080

# Windows: Kill process by PID
taskkill /PID <PID> /F

# Linux/Mac: Kill process using port
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

#### 3. Preserve docker-compose.yml

```
⚠️  docker-compose.yml is the "blueprint" of your system
    Never lose it! Keep it in version control (Git)
    Never delete or modify without understanding the impact
```

#### 4. Quick Reference Commands

```bash
# Full system reset (when everything is broken)
docker-compose down -v              # Remove everything including volumes
docker system prune -af              # Clean all unused resources
docker-compose up -d                 # Start fresh

# Fresh rebuild after major code changes
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View all network connections
docker network ls
docker network inspect equipment-rental-network

# Debug: Execute shell inside container
docker-compose exec backend bash
docker-compose exec frontend sh
```

---

## 🔐 Authentication & Authorization

### JWT Authentication
- Stateless token-based authentication
- HS256 algorithm for token signing
- Configurable token expiration (default: 24 hours)
- Automatic token refresh mechanism

### OAuth2 Integration
- **Google Sign-In** - Quick login with Google accounts
- **Facebook Sign-In** - Quick login with Facebook accounts
- Social account linking with user profiles
- Automatic user creation on first OAuth login

### Role-Based Access Control (RBAC)

| Role   | Permissions                              |
|--------|------------------------------------------|
| ADMIN  | Full system access, equipment management, user management |
| USER   | Browse products, create rentals, place orders, chat support |
| GUEST  | Browse public products, limited access                    |

---

## 🔐 Security

### Environment Variables (Never commit .env)

- `JWT_SECRET` - Minimum 32 characters for token signing
- `DB_PASSWORD` - Strong database password
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - OAuth2 credentials
- `FACEBOOK_CLIENT_ID` & `FACEBOOK_CLIENT_SECRET` - OAuth2 credentials
- `CLOUDINARY_*` - Third-party image service credentials
- `MAIL_USERNAME` & `MAIL_PASSWORD` - Email SMTP credentials

### Best Practices

1. ✅ Use strong JWT secret (32+ characters)
2. ✅ Never commit `.env` files (already in `.gitignore`)
3. ✅ Use HTTPS in production
4. ✅ Rotate JWT tokens regularly (configurable expiration)
5. ✅ Implement rate limiting for API endpoints
6. ✅ Use environment-specific configurations
7. ✅ Keep OAuth2 credentials secure

---

## 🐛 Troubleshooting

### Port Already in Use

**Windows (PowerShell):**

```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill process by PID
taskkill /PID <PID> /F

# For multiple ports
netstat -ano | findstr :3000  # Frontend
netstat -ano | findstr :5173  # Vite dev server
```

**Linux/Mac:**

```bash
# Backend (8080)
lsof -i :8080 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Frontend (5173/3000)
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Maven/Java Issues

```bash
# Verify installation versions
java -version          # Should show Java 21+
mvn --version         # Should show Maven 3.8+

# Backend is failing with "skipping tests"
cd apps/backend
./mvnw clean install -DskipTests

# Clear Maven cache if issues persist
./mvnw clean install -X  # -X for debug output

# Use wrapper instead of global Maven
cd apps/backend
./mvnw spring-boot:run
```

### Database Connection Issues

```bash
# Test MySQL connection
mysql -h localhost -u root -p

# If using Docker Compose
docker-compose exec mysql mysql -u root -p demo_db

# Check backend logs
docker-compose logs -f backend | grep -i "mysql\|database"

# Reset database (clean slate)
docker-compose down -v
docker-compose up -d
```

### Frontend Build Issues

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Check TypeScript errors
npx tsc --noEmit

# Build with verbose output
npm run build -- --debug
```

### Docker Issues

```bash
# Check Docker daemon is running
docker ps

# View all containers (including stopped)
docker ps -a

# View container logs
docker logs -f equipment-rental-backend

# Remove dangling images/containers
docker system prune -f

# Full rebuild (nuclear option)
docker-compose down -v
docker system prune -af
docker-compose build --no-cache
docker-compose up -d

# Check Docker resource usage
docker stats
```

### API Connection Issues

```bash
# Test backend from frontend container
docker-compose exec frontend curl http://backend:8080/swagger-ui.html

# Test with curl from host
curl -v http://localhost:8080/swagger-ui.html

# Check frontend proxy configuration
cat apps/frontend/vite.config.ts  # Verify /api proxy settings

# View environment variables in Docker
docker-compose exec backend env | grep -i "db_host\|jwt"
```

### Common Error Messages

| Error                                | Cause                             | Solution                                              |
|--------------------------------------|-----------------------------------|-------------------------------------------------------|
| `Connection refused: localhost:3306` | MySQL not running                 | Start MySQL or use Docker Compose                     |
| `Port 8080 already in use`           | Another app using port            | Kill process or change port in `.env`                 |
| `JWT token expired`                  | Token TTL exceeded                | Need to refresh token or increase `JWT_EXPIRATION_MS` |
| `CORS error in console`              | Frontend/Backend different origin | Check `vite.config.ts` proxy config                   |
| `Cannot find module 'react'`         | Dependencies not installed        | Run `npm install` in frontend directory               |
| `Module not found: java.base`        | Wrong Java version                | Ensure Java 21+ is configured                         |

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

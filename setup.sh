#!/bin/bash

# Setup script for local development environment

echo "🚀 Setting up Equipment Rental E-Commerce Website..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install Node.js 20+"
  exit 1
fi

if ! command -v mvn &> /dev/null && ! command -v java &> /dev/null; then
  echo "❌ Maven or Java not found. Please install Java 21+"
  exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install:all

echo "📝 Setting up environment..."

# Create backend .env if not exists
if [ ! -f "apps/backend/demo/.env" ]; then
  echo "Creating apps/backend/demo/.env from .env.example..."
  cp apps/backend/demo/.env.example apps/backend/demo/.env
  echo "✅ .env created. Please edit it with your configuration"
else
  echo "✅ .env already exists"
fi

# Create frontend .env if not exists
if [ ! -f "apps/frontend/.env" ]; then
  echo "Creating apps/frontend/.env..."
  cat > apps/frontend/.env << EOF
VITE_API_URL=http://localhost:8080
EOF
  echo "✅ Frontend .env created"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📌 Next steps:"
echo "1. Edit apps/backend/demo/.env with your database credentials"
echo "2. Create MySQL database: CREATE DATABASE demo_db;"
echo "3. Run 'npm run dev' to start development servers"
echo "4. Or run 'docker-compose up -d' to start with Docker"
echo ""
echo "Links:"
echo "  Backend API: http://localhost:8080"
echo "  Frontend: http://localhost:5173"
echo "  Swagger UI: http://localhost:8080/swagger-ui.html"

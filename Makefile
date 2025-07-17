# معلم+ (Moalem Plus) - Makefile
# Makefile for managing frontend and backend development

.PHONY: help install dev-frontend dev-backend dev build-frontend build-backend build clean test lint db-setup db-migrate db-reset status

# Default target
help:
	@echo "معلم+ (Moalem Plus) - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install        - Install all dependencies (frontend + backend)"
	@echo "  dev-frontend   - Start frontend development server"
	@echo "  dev-backend    - Start backend development server"
	@echo "  dev            - Start both frontend and backend in parallel"
	@echo ""
	@echo "Build:"
	@echo "  build-frontend - Build frontend for production"
	@echo "  build-backend  - Build backend for production"
	@echo "  build          - Build both frontend and backend"
	@echo ""
	@echo "Database:"
	@echo "  db-setup       - Create database"
	@echo "  db-migrate     - Run database migrations"
	@echo "  db-reset       - Reset database and run migrations"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean          - Clean all build artifacts"
	@echo "  test           - Run all tests"
	@echo "  lint           - Run linting for frontend"
	@echo "  status         - Show project status"
	@echo ""
	@echo "Quick start: make install && make db-setup && make db-migrate"

# Install dependencies
install:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed"
	@echo "📦 Installing backend dependencies..."
	cd backend && go mod tidy
	@echo "✅ Backend dependencies installed"

# Development servers
dev-frontend:
	@echo "🚀 Starting frontend development server..."
	@echo "🌐 Frontend will be available at: http://localhost:3000"
	cd frontend && npm run dev

dev-backend:
	@echo "🚀 Starting backend development server..."
	@echo "🌐 Backend will be available at: http://localhost:8080"
	cd backend && go run cmd/api/main.go

dev:
	@echo "🚀 Starting development environment..."
	@echo "🌐 Frontend: http://localhost:3000"
	@echo "🌐 Backend: http://localhost:8080"
	@echo "🔄 Starting both servers in parallel..."
	make dev-frontend & make dev-backend

# Build commands
build-frontend:
	@echo "🏗️  Building frontend for production..."
	cd frontend && npm run build
	@echo "✅ Frontend build completed"

build-backend:
	@echo "🏗️  Building backend for production..."
	cd backend && go build -o bin/api cmd/api/main.go
	@echo "✅ Backend build completed"

build:
	@echo "🏗️  Building project..."
	make build-frontend
	make build-backend
	@echo "✅ Build completed"

# Testing
test:
	@echo "🧪 Running tests..."
	cd frontend && npm run lint
	@echo "🧪 Running backend tests..."
	cd backend && go test ./...
	@echo "✅ Tests completed"

# Linting
lint:
	@echo "🔍 Running frontend linting..."
	cd frontend && npm run lint
	@echo "✅ Linting completed"

# Clean up
clean:
	@echo "🧹 Cleaning build artifacts..."
	cd frontend && rm -rf .next node_modules package-lock.json
	cd backend && rm -rf bin/
	@echo "✅ Cleanup completed"

# Docker commands (for future use)
docker-build:
	@echo "🐳 Docker support will be added in deployment phase"

docker-dev:
	@echo "🐳 Docker development environment will be added later"

# Database commands
db-setup:
	@echo "🗄️  Setting up database..."
	createdb moalemplus 2>/dev/null || true
	@echo "✅ Database setup completed"

db-migrate:
	@echo "🗄️  Running database migrations..."
	cd backend && psql moalemplus -f database/migrations/001_create_schools_table.sql
	cd backend && psql moalemplus -f database/migrations/002_create_users_table.sql
	cd backend && psql moalemplus -f database/migrations/003_create_sessions_table.sql
	cd backend && psql moalemplus -f database/migrations/004_create_subjects_table.sql
	cd backend && psql moalemplus -f database/migrations/005_create_curriculum_units_table.sql
	cd backend && psql moalemplus -f database/migrations/006_create_classes_table.sql
	cd backend && psql moalemplus -f database/migrations/007_create_students_table.sql
	cd backend && psql moalemplus -f database/migrations/008_create_student_parents_table.sql
	cd backend && psql moalemplus -f database/migrations/009_create_questions_table.sql
	cd backend && psql moalemplus -f database/migrations/010_create_tests_table.sql
	cd backend && psql moalemplus -f database/migrations/011_create_test_questions_table.sql
	cd backend && psql moalemplus -f database/migrations/012_create_test_submissions_table.sql
	cd backend && psql moalemplus -f database/migrations/013_create_attendance_table.sql
	@echo "✅ Database migrations completed"

db-reset:
	@echo "🗄️  Resetting database..."
	dropdb moalemplus 2>/dev/null || true
	createdb moalemplus
	make db-migrate
	@echo "✅ Database reset completed"

# Status check
status:
	@echo "📊 Project Status:"
	@echo "  ✅ Phase 1: Landing Page - COMPLETED"
	@echo "  ✅ Phase 2: Authentication System - COMPLETED"
	@echo "  ✅ Phase 3: Database Setup - COMPLETED"
	@echo "  ✅ Phase 4: Teacher Dashboard - COMPLETED"
	@echo "  ✅ Phase 5: Class Management - COMPLETED"
	@echo "  ⏳ Phase 6: Test Creation System - PENDING"
	@echo "  ⏳ Phase 7: Educational Games - PENDING"
	@echo "  ⏳ Phase 8: Presentation Tool - PENDING"

# معلم+ (Moalem Plus) - Makefile
# Makefile for managing frontend and backend development

.PHONY: help install dev-frontend dev-backend dev build-frontend build-backend build clean test lint

# Default target
help:
	@echo "معلم+ (Moalem Plus) - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install        - Install all dependencies (frontend + backend)"
	@echo "  dev-frontend   - Start frontend development server"
	@echo "  dev-backend    - Start backend development server (when available)"
	@echo "  dev            - Start both frontend and backend in parallel"
	@echo ""
	@echo "Build:"
	@echo "  build-frontend - Build frontend for production"
	@echo "  build-backend  - Build backend for production (when available)"
	@echo "  build          - Build both frontend and backend"
	@echo ""
	@echo "Maintenance:"
	@echo "  clean          - Clean all build artifacts and node_modules"
	@echo "  test           - Run all tests"
	@echo "  lint           - Run linting for frontend"
	@echo ""
	@echo "Quick start: make install && make dev-frontend"

# Install dependencies
install:
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed"
	@echo "⚠️  Backend not yet available - will be added in phase 2"

# Development servers
dev-frontend:
	@echo "🚀 Starting frontend development server..."
	@echo "🌐 Frontend will be available at: http://localhost:3000"
	cd frontend && npm run dev

dev-backend:
	@echo "⚠️  Backend not yet implemented"
	@echo "🔧 Backend will be available in development phase 2"

dev:
	@echo "🚀 Starting development environment..."
	@echo "📝 Currently only frontend is available"
	@echo "🔧 Backend will be added in phase 2"
	make dev-frontend

# Build commands
build-frontend:
	@echo "🏗️  Building frontend for production..."
	cd frontend && npm run build
	@echo "✅ Frontend build completed"

build-backend:
	@echo "⚠️  Backend build not yet available"
	@echo "🔧 Backend will be available in development phase 2"

build:
	@echo "🏗️  Building project..."
	make build-frontend
	@echo "✅ Build completed"

# Testing
test:
	@echo "🧪 Running tests..."
	cd frontend && npm run lint
	@echo "⚠️  Unit tests will be added in later phases"
	@echo "✅ Basic checks completed"

# Linting
lint:
	@echo "🔍 Running frontend linting..."
	cd frontend && npm run lint
	@echo "✅ Linting completed"

# Clean up
clean:
	@echo "🧹 Cleaning build artifacts..."
	cd frontend && rm -rf .next node_modules package-lock.json
	@echo "✅ Cleanup completed"

# Docker commands (for future use)
docker-build:
	@echo "🐳 Docker support will be added in deployment phase"

docker-dev:
	@echo "🐳 Docker development environment will be added later"

# Database commands (for future use)
db-setup:
	@echo "🗄️  Database setup will be available in phase 3"

db-migrate:
	@echo "🗄️  Database migrations will be available in phase 3"

# Status check
status:
	@echo "📊 Project Status:"
	@echo "  ✅ Phase 1: Landing Page - COMPLETED"
	@echo "  🔧 Phase 2: Authentication System - IN PROGRESS"
	@echo "  ⏳ Phase 3: Database Setup - PENDING"
	@echo "  ⏳ Phase 4: Teacher Dashboard - PENDING"
	@echo "  ⏳ Phase 5: Class Management - PENDING"
	@echo "  ⏳ Phase 6: Test Creation System - PENDING"
	@echo "  ⏳ Phase 7: Educational Games - PENDING"
	@echo "  ⏳ Phase 8: Presentation Tool - PENDING"

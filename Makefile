# Makefile for Equipment Rental Website

.PHONY: help install dev build test lint clean docker-up docker-down

help:
	@echo "Available commands:"
	@echo "  make install      Install all dependencies"
	@echo "  make dev          Start dev servers"
	@echo "  make build        Build for production"
	@echo "  make test         Run tests"
	@echo "  make lint         Run linters"
	@echo "  make clean        Clean build artifacts"
	@echo "  make docker-up    Start Docker containers"
	@echo "  make docker-down  Stop Docker containers"

install:
	npm run install:all

dev:
	npm run dev

build:
	npm run build

test:
	npm run test:ci

lint:
	npm run lint

clean:
	npm run clean

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

backend-dev:
	cd apps/backend && npm run dev

backend-build:
	cd apps/backend && npm run build

backend-test:
	cd apps/backend && npm run test:ci

frontend-dev:
	cd apps/frontend && npm run dev

frontend-build:
	cd apps/frontend && npm run build

frontend-lint:
	cd apps/frontend && npm run lint:fix

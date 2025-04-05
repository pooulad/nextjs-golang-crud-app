run:
	@go build -o ./bin/main .
	@./bin/main

# Simple Makefile for a Go project

# Build the application
all: build test

build:
        @echo "Building..."
        @go build -o ./bin/main.go

# Run the application
run:
  @echo "Running..."
  @go run ./bin/main.go

# Create DB container
docker-run:
        @echo "Starting Docker container..."
        @$(if $(shell command -v docker compose 2>/dev/null), docker compose, docker-compose) up --build

# Shutdown DB container
docker-down:
        @echo "Stopping Docker container..."
        @$(if $(shell command -v docker compose 2>/dev/null), docker compose, docker-compose) down

# Test the application
test:
        @echo "Testing..."
        @go test ./... -v

# Clean the binary
clean:
        @echo "Cleaning..."
        @rm -f ./bin/main

# Live Reload
watch:
        @echo "Watching for changes..."
        @$(if $(shell command -v air 2>/dev/null), air, \
                $(if $(shell read -p "Go's 'air' is not installed. Do you want to install it? [Y/n] " choice; \
                        [ "$$choice" != "n" ] && [ "$$choice" != "N" ]), \
                        go install github.com/air-verse/air@latest && air, \
                        echo "You chose not to install air. Exiting..." && exit 1))

.PHONY: all build run test clean watch docker-run docker-down
.PHONY: build build-simple run interactive compress rules-list shell clean help debug

# Default target
help:
	@echo "Prompt Piper Docker Commands:"
	@echo "  make build        - Build the Docker image"
	@echo "  make build-simple - Build using simple Dockerfile"
	@echo "  make run          - Run interactive mode (default)"
	@echo "  make interactive  - Run interactive mode explicitly"
	@echo "  make compress     - Run compress command"
	@echo "  make rules-list   - List compression rules"
	@echo "  make shell        - Open shell in container"
	@echo "  make debug        - Debug the container"
	@echo "  make clean        - Remove container and image"
	@echo "  make logs         - Show container logs"

# Build the Docker image
build:
	docker build -t prompt-piper:latest .

# Build using simple Dockerfile (fallback option)
build-simple:
	docker build -f Dockerfile.simple -t prompt-piper:latest .

# Run interactive mode (default)
run: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		prompt-piper:latest interactive

# Debug the container
debug: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		--entrypoint /bin/sh \
		prompt-piper:latest

# Explicitly run interactive mode
interactive: run

# Run with dry mode
interactive-dry: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		prompt-piper:latest interactive --dry

# Run with Claude mode
interactive-claude: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		prompt-piper:latest interactive --claude

# Run compress command
compress: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		prompt-piper:latest compress

# List compression rules
rules-list: build
	docker run -it --rm \
		prompt-piper:latest rules:list

# Open shell in container for debugging
shell: build
	docker run -it --rm \
		-v "$$(pwd)/prompts:/app/prompts" \
		-v "$$(pwd)/logs:/app/logs" \
		-v "$$(pwd)/output:/app/output" \
		-v "$$(pwd)/.env:/app/.env:ro" \
		-v "$$(pwd)/src:/app/src:ro" \
		prompt-piper:latest sh

# Run with docker-compose
compose-up:
	docker-compose up

compose-down:
	docker-compose down

# Show logs
logs:
	docker logs prompt-piper-cli

# Clean up
clean:
	docker rm -f prompt-piper-cli 2>/dev/null || true
	docker rmi prompt-piper:latest 2>/dev/null || true

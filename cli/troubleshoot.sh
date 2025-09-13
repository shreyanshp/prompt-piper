#!/bin/bash

echo "🔍 Prompt Piper Docker Troubleshooting Script"
echo "============================================"

# Check if Docker is running
echo -n "Checking Docker status... "
if docker info > /dev/null 2>&1; then
    echo "✅ Docker is running"
else
    echo "❌ Docker is not running or not installed"
    exit 1
fi

# Check for required files
echo ""
echo "Checking required files:"
for file in package.json Dockerfile; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file is missing"
    fi
done

# Create required directories if they don't exist
echo ""
echo "Creating required directories:"
for dir in prompts logs output; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "  📁 Created $dir/"
    else
        echo "  ✅ $dir/ exists"
    fi
done

# Check for .env file
echo ""
if [ -f ".env" ]; then
    echo "✅ .env file exists"
else
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "  📝 Created .env from .env.example"
    else
        echo "  ❌ .env.example not found either"
    fi
fi

# Try building with simple Dockerfile first
echo ""
echo "Testing Docker build:"
echo "--------------------"
if [ -f "Dockerfile.simple" ]; then
    echo "Trying simple build first..."
    if docker build -f Dockerfile.simple -t prompt-piper:test-simple . > /dev/null 2>&1; then
        echo "✅ Simple Dockerfile builds successfully"
        echo ""
        echo "You can use: make build-simple && make run"
    else
        echo "❌ Simple Dockerfile failed to build"
    fi
fi

# Test main Dockerfile
echo ""
echo "Testing main Dockerfile..."
if docker build -t prompt-piper:test . > /dev/null 2>&1; then
    echo "✅ Main Dockerfile builds successfully"
else
    echo "❌ Main Dockerfile failed to build"
    echo ""
    echo "Try running: docker build -t prompt-piper:latest . "
    echo "to see the full error output"
fi

# Clean up test images
docker rmi prompt-piper:test prompt-piper:test-simple > /dev/null 2>&1

echo ""
echo "============================================"
echo "Troubleshooting complete!"
echo ""
echo "Quick fixes to try:"
echo "1. If entrypoint fails: make build-simple && make run"
echo "2. For debugging: make debug"
echo "3. To see what's in the container: make shell"

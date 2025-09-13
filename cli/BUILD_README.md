# Prompt Piper CLI - Build & Deployment Guide

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Local Development](#local-development)
- [Docker Build](#docker-build)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deployment Options](#deployment-options)
- [Troubleshooting](#troubleshooting)
- [Performance Optimization](#performance-optimization)

## Prerequisites

### Required Tools
- **Bun**: v1.0+ (or Node.js 22+ as fallback)
- **Docker**: v20.10+ (for containerized builds)
- **Git**: For version control
- **TypeScript**: v5.5+ (included in devDependencies)

### Installation
```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Or use Node.js 22
nvm install 22
nvm use 22
```

## Project Structure

```
prompt-piper-cli/
├── src/                    # TypeScript source files
│   ├── index.ts           # Main CLI entry point
│   ├── interactive.ts     # Interactive mode implementation
│   └── components/        # CLI components
├── bin/                    # Executable scripts
│   ├── prompt-piper.js    # Main CLI executable
│   └── prompt-piper-interactive.js
├── prompts/               # Input prompts directory
├── logs/                  # Application logs
├── output/                # Compressed outputs
├── dist/                  # Compiled JavaScript (generated)
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── Dockerfile             # Container definition
└── docker-compose.yml     # Container orchestration
```

## Local Development

### Initial Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd prompt-piper-cli

# Install dependencies
bun install
# or: npm install

# Create required directories
mkdir -p prompts logs output

# Copy environment template
cp .env.example .env
# Edit .env with your API keys
```

### Build Commands

#### Using Bun (Fastest)
```bash
# Install dependencies
bun install

# Build TypeScript to JavaScript
bun run build

# Run in development mode
bun run dev

# Run interactive mode
bun run interactive

# Run with specific flags
bun run interactive --dry
bun run interactive --claude
```

#### Using NPM/Node.js
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run commands
npm run dev
npm run interactive
npm run compress
```

### Development Workflow
```bash
# 1. Make changes to TypeScript files in src/
# 2. Build the project
bun run build

# 3. Test locally
bun run interactive

# 4. Run with hot reload (if configured)
bun --watch src/index.ts
```

## Docker Build

### Quick Start
```bash
# Build and run with Make
make build
make run

# Or manually with Docker
docker build -t prompt-piper:latest .
docker run -it --rm prompt-piper:latest
```

### Build Variants

#### 1. Production Build (Optimized)
```dockerfile
# Multi-stage build for smaller image
FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN bun install --production
COPY . .
RUN bun run build

FROM oven/bun:1-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["bun", "dist/index.js"]
```

#### 2. Development Build
```bash
# Build with source mounting for hot reload
docker build -f Dockerfile.dev -t prompt-piper:dev .
docker run -it --rm -v $(pwd)/src:/app/src prompt-piper:dev
```

#### 3. Simple Build (Fallback)
```bash
# Use when having entrypoint issues
docker build -f Dockerfile.simple -t prompt-piper:simple .
docker run -it --rm prompt-piper:simple
```

### Build Arguments
```bash
# Build with custom base image
docker build --build-arg BASE_IMAGE=node:22-alpine -t prompt-piper:node .

# Build with specific Bun version
docker build --build-arg BUN_VERSION=1.1.0 -t prompt-piper:latest .
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/build.yml
name: Build and Push

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - name: Install dependencies
        run: bun install
      
      - name: Run tests
        run: bun test
      
      - name: Build TypeScript
        run: bun run build
      
      - name: Build Docker image
        run: |
          docker build -t prompt-piper:${{ github.sha }} .
          docker tag prompt-piper:${{ github.sha }} prompt-piper:latest
      
      - name: Push to Registry
        if: github.event_name == 'push' && startsWith(github.ref, 'refs/tags/')
        run: |
          echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
          docker push prompt-piper:latest
          docker push prompt-piper:${{ github.sha }}
```

### GitLab CI
```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  image: oven/bun:1-alpine
  script:
    - bun install
    - bun run build
  artifacts:
    paths:
      - dist/
      - node_modules/

docker-build:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Deployment Options

### 1. Standalone Binary
```bash
# Create standalone executable with Bun
bun build ./src/index.ts --compile --outfile prompt-piper

# Now you have a single executable
./prompt-piper --help
```

### 2. NPM Package
```bash
# Prepare for npm publish
npm run build
npm pack

# Publish to npm registry
npm publish

# Users can install globally
npm install -g prompt-piper-cli
```

### 3. Docker Hub
```bash
# Tag for Docker Hub
docker tag prompt-piper:latest yourusername/prompt-piper:latest
docker tag prompt-piper:latest yourusername/prompt-piper:v1.0.0

# Push to Docker Hub
docker push yourusername/prompt-piper:latest
docker push yourusername/prompt-piper:v1.0.0

# Users can run directly
docker run -it yourusername/prompt-piper:latest
```

### 4. Cloud Deployment

#### AWS Lambda
```bash
# Build for Lambda
docker build -f Dockerfile.lambda -t prompt-piper-lambda .

# Deploy using SAM or Serverless Framework
sam deploy --template-file template.yaml
```

#### Google Cloud Run
```bash
# Build and push to GCR
gcloud builds submit --tag gcr.io/PROJECT-ID/prompt-piper

# Deploy to Cloud Run
gcloud run deploy prompt-piper \
  --image gcr.io/PROJECT-ID/prompt-piper \
  --platform managed
```

#### Kubernetes
```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prompt-piper
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prompt-piper
  template:
    metadata:
      labels:
        app: prompt-piper
    spec:
      containers:
      - name: prompt-piper
        image: prompt-piper:latest
        stdin: true
        tty: true
        volumeMounts:
        - name: prompts
          mountPath: /app/prompts
        - name: outputs
          mountPath: /app/output
```

## Performance Optimization

### Build Optimization
```dockerfile
# Use multi-stage builds
FROM oven/bun:1-alpine AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

FROM oven/bun:1-alpine AS builder
WORKDIR /app
COPY package.json tsconfig.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
RUN bun run build

FROM oven/bun:1-distroless
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
CMD ["dist/index.js"]
```

### Caching Strategy
```bash
# Use Docker build cache
docker build --cache-from prompt-piper:latest -t prompt-piper:latest .

# Use BuildKit for better caching
DOCKER_BUILDKIT=1 docker build -t prompt-piper:latest .

# Use registry cache
docker build \
  --cache-from type=registry,ref=myregistry/prompt-piper:cache \
  --cache-to type=registry,ref=myregistry/prompt-piper:cache,mode=max \
  -t prompt-piper:latest .
```

### Size Optimization
```bash
# Check image size
docker images prompt-piper

# Analyze layers
docker history prompt-piper:latest

# Remove unnecessary files
# Add to .dockerignore:
# - *.md
# - tests/
# - .git/
# - docs/
```

## Troubleshooting

### Common Build Issues

#### 1. TypeScript Compilation Errors
```bash
# Clear build cache
rm -rf dist/
rm -rf node_modules/
bun install
bun run build
```

#### 2. Docker Build Failures
```bash
# Run troubleshooting script
./troubleshoot.sh

# Build with verbose output
docker build --progress=plain -t prompt-piper:latest .

# Use simple Dockerfile
docker build -f Dockerfile.simple -t prompt-piper:latest .
```

#### 3. Permission Issues
```bash
# Fix directory permissions
chmod -R 755 prompts logs output
chown -R $(whoami) prompts logs output
```

#### 4. Memory Issues
```bash
# Increase Node memory for build
NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Increase Docker memory
docker build --memory=4g -t prompt-piper:latest .
```

### Debug Commands
```bash
# Enter container shell
make debug
# or
docker run -it --rm --entrypoint /bin/sh prompt-piper:latest

# Check file structure
ls -la /app/

# Test commands manually
bun run interactive
node dist/index.js

# Check environment
env | grep -E 'NODE|BUN|TERM'
```

## Version Management

### Semantic Versioning
```bash
# Update version in package.json
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0

# Tag Docker images
docker tag prompt-piper:latest prompt-piper:v1.0.0
docker tag prompt-piper:latest prompt-piper:v1
docker tag prompt-piper:latest prompt-piper:stable
```

### Release Process
```bash
# 1. Update version
npm version minor

# 2. Build and test
bun run build
bun test

# 3. Build Docker image
docker build -t prompt-piper:v$(node -p "require('./package.json').version") .

# 4. Tag and push
git push --tags
docker push prompt-piper:v$(node -p "require('./package.json').version")
```

## Security Best Practices

### Build Security
```dockerfile
# Run as non-root user
FROM oven/bun:1-alpine
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Scan for vulnerabilities
# Use Trivy or Snyk
trivy image prompt-piper:latest
snyk container test prompt-piper:latest
```

### Environment Variables
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use secrets in CI/CD
docker build --secret id=api_key,src=.env -t prompt-piper:latest .

# Runtime secrets
docker run --env-file .env prompt-piper:latest
```

## Contributing

### Development Setup
```bash
# Fork and clone
git clone https://github.com/yourusername/prompt-piper-cli.git
cd prompt-piper-cli

# Create feature branch
git checkout -b feature/amazing-feature

# Install and build
bun install
bun run build

# Test your changes
bun test
bun run interactive

# Commit and push
git add .
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

## Support

- **Issues**: GitHub Issues
- **Documentation**: `/docs` directory
- **Examples**: `/examples` directory
- **Community**: Discord/Slack channel

## License

MIT License - see LICENSE file for details
# Use the official Bun image (Alpine-based, very small)
FROM oven/bun:1-alpine AS base

WORKDIR /app

# Copy package files first for better caching
COPY package.json ./
COPY tsconfig.json* ./

# Install dependencies using bun (much faster than npm)
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build TypeScript if needed
RUN if [ -f "tsconfig.json" ]; then bun run build || true; fi

# Create directories for logs and prompts
RUN mkdir -p logs prompts output node_modules

# Set environment variables for interactive terminal
ENV TERM=xterm-256color
ENV FORCE_COLOR=1

# Create entrypoint script with proper formatting
RUN cat > /app/docker-entrypoint.sh << 'EOF' && chmod +x /app/docker-entrypoint.sh
#!/bin/sh
set -e

if [ "$1" = "interactive" ] || [ "$1" = "ppi" ]; then
    shift
    exec bun run interactive "$@"
elif [ "$1" = "compress" ]; then
    shift
    exec bun run compress "$@"
elif [ "$1" = "rules:list" ]; then
    exec bun run rules:list
elif [ "$1" = "sh" ] || [ "$1" = "bash" ]; then
    exec /bin/sh
else
    exec bun run dev "$@"
fi
EOF

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["interactive"]

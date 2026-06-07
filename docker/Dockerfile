FROM node:20-bookworm-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install OpenCode and OpenChamber globally
RUN npm install -g opencode-ai @openchamber/web --quiet

# Create working directory
WORKDIR /app

# Copy supervisor script
COPY supervisor.js /app/supervisor.js

# Expose ports
EXPOSE 3000
EXPOSE 4095

# Set persistent data path
ENV STACK_DATA_DIR=/data
VOLUME ["/data"]

# Start supervisor
CMD ["node", "/app/supervisor.js"]

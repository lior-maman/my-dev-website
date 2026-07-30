FROM node:22-alpine

WORKDIR /app

# Copy manifests first for better layer caching
COPY package*.json ./

RUN npm ci --omit=dev

# Copy source (respect .dockerignore)
COPY . .

# Drop root privileges
USER node

EXPOSE 8080

# Run node directly so signals propagate
CMD ["node", "server.js"]

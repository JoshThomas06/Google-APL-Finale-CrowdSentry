# Stage 1: Build the React client using Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Minimal production runtime
FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
# Use --omit=dev (replaces deprecated --only=production for npm v9+)
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.js ./

# Run as non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Environment
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Health check so Cloud Run can verify the server is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:8080/ || exit 1

CMD ["npm", "start"]

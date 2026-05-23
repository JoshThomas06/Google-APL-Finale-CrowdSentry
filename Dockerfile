# Stage 1: Build the React client using Vite
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Express server and assets
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
COPY server.js ./

# Set Environment variables
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080
CMD ["npm", "start"]

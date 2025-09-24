# ---- Build stage ----
FROM node:24-alpine AS builder

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy rest of code
COPY . .

# Build NestJS
RUN npm run build

# ---- Runtime stage ----
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only needed files
COPY package*.json ./
RUN npm install --only=production

# Copy built code from builder
COPY --from=builder /app/dist ./dist

# Copy Prisma folder (needed for migrations & schema)
COPY --from=builder /app/prisma ./prisma

# Expose backend port
EXPOSE 8000

# Default command
CMD ["node", "dist/main.js"]

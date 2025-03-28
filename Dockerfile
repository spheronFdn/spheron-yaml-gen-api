# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Production stage
FROM node:18-alpine

# Create non-root user
RUN addgroup -S nodegp && adduser -S nodeapp -G nodegp

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src ./src
COPY --from=builder /app/templates ./templates
COPY --from=builder /app/yaml ./yaml
COPY --from=builder /app/node_modules ./node_modules

# Set ownership to non-root user
RUN chown -R nodeapp:nodegp /app

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

# Start the application
CMD ["node", "src/index.js"]

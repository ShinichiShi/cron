# Use Node.js 18 as base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Build the project
RUN npm run build

# -----------------------------
# Use a new, smaller image for production
FROM node:18-alpine

WORKDIR /app

# Copy only built files and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Expose the application port
EXPOSE 3000

# Start the compiled app
CMD ["node", "dist/src/main"]

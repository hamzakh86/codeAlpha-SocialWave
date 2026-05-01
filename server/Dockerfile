# ---- Backend Dockerfile ----
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy application source
COPY . .

# Create assets directories (for uploads)
RUN mkdir -p assets/userFiles assets/userAvatars

# Expose backend port
EXPOSE 5000

# Start the server
CMD ["node", "app.js"]

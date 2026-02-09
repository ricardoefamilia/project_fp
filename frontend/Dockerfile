FROM node:22-alpine

# Install pnpm globally
RUN npm install -g pnpm@latest

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Expose port (Vite default is 5173)
EXPOSE 5173

# Default command for development
CMD ["pnpm", "dev", "--host"]


FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# The built app is self-contained with adapter-node
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production

# The built SvelteKit server is in build/index.js
CMD ["node", "build/index.js"]

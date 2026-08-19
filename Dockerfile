FROM node:24-alpine AS builder

WORKDIR /app

# Install libc6-compat for native modules (Tailwind oxide & esbuild)
RUN apk add --no-cache libc6-compat

# Install pnpm via corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency configuration files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

# Install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

RUN apk add --no-cache libc6-compat

# Copy built application and package definition
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Run the SvelteKit node server
CMD ["node", "build/index.js"]

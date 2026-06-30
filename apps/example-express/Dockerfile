FROM node:22-alpine
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/example-express/ ./apps/example-express/

RUN pnpm install

# Build workspace packages before starting the app
RUN pnpm -r --filter './packages/**' build

WORKDIR /app/apps/example-express

EXPOSE 3001
CMD ["pnpm", "dev"]

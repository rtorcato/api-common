FROM node:22-alpine
RUN corepack enable

WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY apps/example-ts-rest-express/ ./apps/example-ts-rest-express/

RUN pnpm install

# Build workspace packages before starting the app
RUN pnpm -r --filter './packages/**' build

WORKDIR /app/apps/example-ts-rest-express

EXPOSE 3003
CMD ["pnpm", "dev"]

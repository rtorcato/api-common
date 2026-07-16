---
title: Hono example
description: Runnable Hono app wiring every api-common package together.
---

The `apps/example-hono` directory contains a working Hono API that wires
every `@rtorcato/api-*` package together. The API contract is identical to
the [Express example](./express.md) — same routes, same response shapes —
so you can compare the two implementations side by side.

## What it demonstrates

| Package | Usage in the example |
|---|---|
| [`api-config`](https://github.com/rtorcato/api-common/tree/main/packages/api-config) | `loadEnv()` validates `PORT` + `LOG_LEVEL` from `.env` at startup |
| [`api-logger`](https://github.com/rtorcato/api-common/tree/main/packages/api-logger) | `createLogger()` gives a pino logger, pretty-printed in dev |
| [`api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors) | `NotFoundError` is thrown when an item ID doesn't exist |
| [`api-errors-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-hono) | `errorHandler()` + `notFoundHandler` via `app.onError` / `app.notFound` |
| [`api-rate-limit`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit) | `createRateLimiter()` — 100 req/min sliding window keyed on forwarded IP |
| [`api-response`](https://github.com/rtorcato/api-common/tree/main/packages/api-response) | `ok()` wraps every success payload in `{ success: true, data }` |
| [`api-validation`](https://github.com/rtorcato/api-common/tree/main/packages/api-validation) | `validate()` parses POST bodies and throws `BadRequestError` on failure |
| [`api-timeout-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-timeout-hono) | `timeoutMiddleware({ ms })` — a slow handler is failed with a `503` instead of hanging |
| [`api-webhooks-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-webhooks-hono) | `webhookMiddleware()` verifies an HMAC signature on `POST /webhooks` (opt-in via `webhookSecret`) |
| [`@hono/swagger-ui`](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) | Swagger UI at `/api-docs`; raw spec served at `/api-docs/json` |

## Routes

```
GET    /items
POST   /items          { "name": string }
GET    /items/:id
DELETE /items/:id
POST   /webhooks       HMAC-verified receiver (when webhookSecret is set)
GET    /api-docs       Swagger UI
GET    /api-docs/json  raw OpenAPI spec
```

Items are stored in-memory — no database required.

## Run locally

```bash
cd apps/example-hono
cp .env.example .env
pnpm dev
```

The server starts on `http://localhost:3002` with pretty-printed logs.

- Swagger UI → `http://localhost:3002/api-docs`
- Raw spec → `http://localhost:3002/api-docs/json`

## Run with Docker

```bash
cd apps/example-hono
docker compose up
```

The image builds from the monorepo root, installs workspace packages, and
starts the server on port `3002`.

## Quick smoke test

```bash
# List items (empty)
curl http://localhost:3002/items

# Create
curl -X POST http://localhost:3002/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"world"}'

# 404 for a bad ID
curl http://localhost:3002/items/bad-id

# 400 validation error — missing name
curl -X POST http://localhost:3002/items \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Source

[`apps/example-hono/src/index.ts`](https://github.com/rtorcato/api-common/tree/main/apps/example-hono/src/index.ts)

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
| [`api-auth`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth) | `signToken()` issues a JWT on `POST /login` |
| [`api-auth-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth-hono) | `authMiddleware()` guards `GET /me` and exposes the user via `c.get('user')` |
| [`api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors) | `BadRequestError` (failed validation) + `NotFoundError` (missing item) are thrown from handlers |
| [`api-errors-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-hono) | `errorHandler()` + `notFoundHandler` via `app.onError` / `app.notFound` |
| [`api-health`](https://github.com/rtorcato/api-common/tree/main/packages/api-health) | `createHealthRegistry()` tracks the readiness checks |
| [`api-health-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-health-hono) | `livenessHandler()` / `readinessHandler()` back `/healthz` + `/readyz` |
| [`api-rate-limit-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit-hono) | `rateLimitMiddleware()` — 100 req/min sliding window keyed on forwarded IP |
| [`api-timeout-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-timeout-hono) | `timeoutMiddleware({ ms })` — a slow handler is failed with a `503` instead of hanging |
| [`api-webhooks-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-webhooks-hono) | `webhookMiddleware()` verifies an HMAC signature on `POST /webhooks` (opt-in via `webhookSecret`) |
| [`api-response`](https://github.com/rtorcato/api-common/tree/main/packages/api-response) | `ok()` wraps every success payload in `{ success: true, data }` |
| [`api-openapi-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-hono) | `configureOpenAPI()` serves the schema-generated OpenAPI 3.1 doc at `/doc` and the Scalar reference UI at `/reference` |
| [`api-graceful-shutdown`](https://github.com/rtorcato/api-common/tree/main/packages/api-graceful-shutdown) | `createShutdownController()` drains the server on `SIGTERM`/`SIGINT` (in `index.ts`) |

Request bodies are validated by the `@hono/zod-openapi` route schemas — a failed
parse routes through the shared error envelope via the app's `defaultHook`, so
this example needs no separate validation package.

## Routes

```
GET    /items
POST   /items          { "name": string }
GET    /items/:id
DELETE /items/:id
POST   /login          { "username": string }  → { token }
GET    /me             Bearer token required
POST   /webhooks       HMAC-verified receiver (when webhookSecret is set)
GET    /healthz        liveness probe
GET    /readyz         readiness probe
GET    /doc            OpenAPI 3.1 document
GET    /reference      Scalar API reference
```

Items are stored in-memory — no database required.

## Run locally

```bash
cd apps/example-hono
cp .env.example .env
pnpm dev
```

The server starts on `http://localhost:3002` with pretty-printed logs.

- Scalar API reference → `http://localhost:3002/reference`
- OpenAPI 3.1 document → `http://localhost:3002/doc`

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

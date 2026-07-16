---
title: Express example
description: Runnable Express 5 app wiring every api-common package together.
---

The `apps/example-express` directory contains a working Express 5 API that
wires every `@rtorcato/api-*` package together so you can see how they
interact in a real server.

## What it demonstrates

| Package | Usage in the example |
|---|---|
| [`api-config`](https://github.com/rtorcato/api-common/tree/main/packages/api-config) | `loadEnv()` validates `PORT` + `LOG_LEVEL` from `.env` at startup |
| [`api-logger`](https://github.com/rtorcato/api-common/tree/main/packages/api-logger) | `createLogger()` gives a pino logger, pretty-printed in dev |
| [`api-auth`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth) | `signToken()` issues a JWT on `POST /login` |
| [`api-auth-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth-express) | `authMiddleware()` guards `GET /me` |
| [`api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors) | `NotFoundError` is thrown when an item ID doesn't exist |
| [`api-errors-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-express) | `errorHandler()` + `notFoundHandler` convert those errors to JSON; `asyncHandler()` wraps async routes |
| [`api-express-utils`](https://github.com/rtorcato/api-common/tree/main/packages/api-express-utils) | `getIP()` keys the rate limiter; `logRoutes()` prints routes on start |
| [`api-security-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-security-express) | `securityMiddleware()` sets helmet security headers on every response |
| [`api-cors-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-cors-express) | `corsMiddleware()` applies the CORS policy |
| [`api-timeout-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-timeout-express) | `timeoutMiddleware({ ms })` — a slow request is failed with a `503` instead of hanging |
| [`api-rate-limit-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit-express) | `rateLimitMiddleware()` — 100 req/min sliding window, in-memory |
| [`api-webhooks-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-webhooks-express) | `webhookMiddleware()` verifies an HMAC signature on `POST /webhooks` (opt-in via `webhookSecret`) |
| [`api-health`](https://github.com/rtorcato/api-common/tree/main/packages/api-health) | `createHealthRegistry()` tracks the readiness checks |
| [`api-health-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-health-express) | `livenessHandler()` / `readinessHandler()` back `/healthz` + `/readyz` |
| [`api-upload`](https://github.com/rtorcato/api-common/tree/main/packages/api-upload) | `uploadFile()` streams `POST /upload` to S3 (wired when an S3 client is provided) |
| [`api-validation`](https://github.com/rtorcato/api-common/tree/main/packages/api-validation) | `validate()` parses POST bodies and throws `BadRequestError` on failure |
| [`api-response`](https://github.com/rtorcato/api-common/tree/main/packages/api-response) | `ok()` wraps every success payload in `{ success: true, data }` |
| [`api-openapi`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi) | OpenAPI spec defined in `src/spec.ts`; `generateScalarHtml` / `generateSwaggerHtml` render the UI pages |
| [`api-openapi-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-express) | `serveApiDocs()` mounts Scalar UI at `/api-docs`; `serveSwaggerDocs()` mounts Swagger UI at `/swagger` |
| [`api-graceful-shutdown`](https://github.com/rtorcato/api-common/tree/main/packages/api-graceful-shutdown) | `createShutdownController()` drains the server on `SIGTERM`/`SIGINT` (in `index.ts`) |

## Routes

```
GET    /items
POST   /items              { "name": string }
GET    /items/:id
DELETE /items/:id
POST   /login             { "username": string }  → { token }
GET    /me                Bearer token required
POST   /upload            multipart file → S3 (when an S3 client is configured)
POST   /webhooks          HMAC-verified receiver (when webhookSecret is set)
GET    /healthz           liveness probe
GET    /readyz            readiness probe
GET    /api-docs           Scalar API reference
GET    /api-docs/openapi.json
GET    /swagger            Swagger UI
GET    /swagger/openapi.json
```

Items are stored in-memory — no database required.

## Run locally

```bash
cd apps/example-express
cp .env.example .env
pnpm dev
```

The server starts on `http://localhost:3001` with pretty-printed logs.

- Scalar API reference → `http://localhost:3001/api-docs`
- Swagger UI → `http://localhost:3001/swagger`

## Run with Docker

```bash
cd apps/example-express
docker compose up
```

The image builds from the monorepo root, installs workspace packages, and
starts the server on port `3001`.

## Quick smoke test

```bash
# List items (empty)
curl http://localhost:3001/items

# Create
curl -X POST http://localhost:3001/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"hello"}'

# 404 for a bad ID
curl http://localhost:3001/items/bad-id

# 400 validation error — missing name
curl -X POST http://localhost:3001/items \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Source

[`apps/example-express/src/index.ts`](https://github.com/rtorcato/api-common/tree/main/apps/example-express/src/index.ts)

# example-hono

Runnable Hono API demonstrating `@rtorcato/api-*` packages working together,
built **schema-first** on `OpenAPIHono`: the item routes are defined with
`createRoute` Zod schemas that drive both request validation and the generated
OpenAPI doc, so the API and its docs can't drift.

## What it shows

| Package | Usage |
|---|---|
| `api-config` | Load `PORT` + `LOG_LEVEL` + `JWT_SECRET` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-errors` + `api-errors-hono` | Typed HTTP errors + `onError`/`notFound` handlers |
| `api-auth` + `api-auth-hono` | `signToken` on `POST /login`; `authMiddleware` guards `GET /me` |
| `api-health` + `api-health-hono` | `/healthz` (liveness) + `/readyz` (readiness registry) |
| `api-rate-limit-hono` | 100 req/min sliding-window limiter keyed on forwarded IP |
| `api-response` | `ok()` success envelope on every response |
| `api-openapi-hono` | `configureOpenAPI` — OpenAPI 3.1 at `/doc` + Scalar UI at `/reference`, generated from the route schemas |
| `api-graceful-shutdown` | Drains in-flight requests on SIGTERM/SIGINT (`src/index.ts`) |

Request validation comes from the `createRoute` schemas via an `OpenAPIHono`
`defaultHook` that raises a `BadRequestError` (`validation_error`), so failures
use the shared error envelope.

## Routes

```
POST   /login      body: { "username": string }   → { token }
GET    /me         Authorization: Bearer <token>   (protected)
GET    /items
POST   /items      body: { "name": string }
GET    /items/:id
DELETE /items/:id
GET    /healthz                 liveness probe
GET    /readyz                  readiness probe (503 if a check fails)
GET    /reference               Scalar API reference (generated from routes)
GET    /doc                     OpenAPI 3.1 spec
```

## Run locally

```bash
cp .env.example .env
pnpm dev
# → http://localhost:3002
# → http://localhost:3002/reference  (Scalar)
```

## Run with Docker

```bash
docker compose up
# → http://localhost:3002
# → http://localhost:3002/reference  (Scalar)
```

## Quick smoke test

```bash
curl http://localhost:3002/items
curl -X POST http://localhost:3002/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"world"}'
curl http://localhost:3002/items/bad-id   # → 404
curl -X POST http://localhost:3002/items \
  -H 'Content-Type: application/json' \
  -d '{}'                                 # → 400 validation error

TOKEN=$(curl -s -X POST http://localhost:3002/login \
  -H 'Content-Type: application/json' -d '{"username":"ada"}' | sed 's/.*"token":"//;s/".*//')
curl http://localhost:3002/me -H "Authorization: Bearer $TOKEN"   # → 200
curl http://localhost:3002/me                                     # → 401
curl http://localhost:3002/readyz                                 # → 200
```

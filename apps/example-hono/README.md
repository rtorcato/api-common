# example-hono

Runnable Hono API demonstrating all `@rtorcato/api-*` packages working together.

## What it shows

| Package | Usage |
|---|---|
| `api-config` | Load `PORT` + `LOG_LEVEL` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-errors` + `api-errors-hono` | Typed HTTP errors + `onError`/`notFound` handlers |
| `api-rate-limit` | 100 req/min sliding-window limiter keyed on forwarded IP |
| `api-response` | `ok()` success envelope on every response |
| `api-validation` | `validate()` on POST body — throws `BadRequestError` on mismatch |
| `@hono/swagger-ui` | Swagger UI at `/api-docs` backed by `/api-docs/json` |

## Routes

```
GET    /items
POST   /items      body: { "name": string }
GET    /items/:id
DELETE /items/:id
GET    /api-docs        Swagger UI
GET    /api-docs/json
```

## Run locally

```bash
cp .env.example .env
pnpm dev
# → http://localhost:3002
# → http://localhost:3002/api-docs  (Swagger UI)
```

## Run with Docker

```bash
docker compose up
# → http://localhost:3002
# → http://localhost:3002/api-docs  (Swagger UI)
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
```

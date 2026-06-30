# example-express

Runnable Express 5 API demonstrating all `@rtorcato/api-*` packages working together.

## What it shows

| Package | Usage |
|---|---|
| `api-config` | Load `PORT` + `LOG_LEVEL` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-errors` + `api-errors-express` | Typed HTTP errors + error/404 middleware |
| `api-express-utils` | `getIP()` for rate-limit keying, `logRoutes()` on startup |
| `api-rate-limit` | 100 req/min sliding-window limiter |
| `api-response` | `ok()` success envelope on every response |
| `api-validation` | `validate()` on POST body — throws `BadRequestError` on mismatch |
| `api-openapi` + `api-openapi-express` | `serveApiDocs` (Scalar) at `/api-docs`, `serveSwaggerDocs` (Swagger UI) at `/swagger` |

## Routes

```
GET    /items
POST   /items      body: { "name": string }
GET    /items/:id
DELETE /items/:id
GET    /api-docs            Scalar API reference
GET    /api-docs/openapi.json
GET    /swagger             Swagger UI
GET    /swagger/openapi.json
```

## Run locally

```bash
cp .env.example .env
pnpm dev
# → http://localhost:3001
# → http://localhost:3001/api-docs   (Scalar)
# → http://localhost:3001/swagger    (Swagger UI)
```

## Run with Docker

```bash
docker compose up
# → http://localhost:3001
# → http://localhost:3001/api-docs   (Scalar)
# → http://localhost:3001/swagger    (Swagger UI)
```

## Quick smoke test

```bash
curl http://localhost:3001/items
curl -X POST http://localhost:3001/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"hello"}'
curl http://localhost:3001/items/bad-id   # → 404
curl -X POST http://localhost:3001/items \
  -H 'Content-Type: application/json' \
  -d '{}'                                 # → 400 validation error
```

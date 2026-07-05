# example-express

Runnable Express 5 API demonstrating all `@rtorcato/api-*` packages working together.

## What it shows

| Package | Usage |
|---|---|
| `api-config` | Load `PORT`, `LOG_LEVEL`, `JWT_SECRET`, `S3_*` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-errors` + `api-errors-express` | Typed HTTP errors + error/404 middleware, `asyncHandler` |
| `api-cors-express` | CORS locked to `http://localhost:3000` |
| `api-auth` + `api-auth-express` | `signToken()` on `POST /login`, `authMiddleware` guarding `GET /me` |
| `api-health` + `api-health-express` | `/healthz` liveness + `/readyz` readiness (registry-driven) |
| `api-upload` | `POST /upload` streams a multipart file straight to S3/MinIO |
| `api-graceful-shutdown` | Drains the HTTP server on `SIGTERM`/`SIGINT` |
| `api-express-utils` | `getIP()` for rate-limit keying, `logRoutes()` on startup |
| `api-rate-limit` | 100 req/min sliding-window limiter |
| `api-response` | `ok()` success envelope on every response |
| `api-validation` | `validate()` on POST body — throws `BadRequestError` on mismatch |
| `api-openapi` + `api-openapi-express` | `serveApiDocs` (Scalar) at `/api-docs`, `serveSwaggerDocs` (Swagger UI) at `/swagger` |

## Routes

```
POST   /login      body: { "username": string }  → { token }
GET    /me         Authorization: Bearer <token>
GET    /healthz            liveness probe
GET    /readyz             readiness probe
GET    /items
POST   /items      body: { "name": string }
GET    /items/:id
DELETE /items/:id
POST   /upload     multipart field "file"  (needs S3/MinIO)
GET    /api-docs            Scalar API reference
GET    /api-docs/openapi.json
GET    /swagger             Swagger UI
GET    /swagger/openapi.json
```

CORS is restricted to `http://localhost:3000`, and the server drains
in-flight requests on `SIGTERM`/`SIGINT` before exiting.

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
# → http://localhost:9001            (MinIO console, minioadmin/minioadmin)
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

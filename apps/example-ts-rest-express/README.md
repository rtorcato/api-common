# example-ts-rest-express

Runnable Express 5 API built **contract-first** with [ts-rest](https://ts-rest.com), via `@rtorcato/api-ts-rest-express`.

Where [`example-express`](../example-express) wires routes and the OpenAPI spec by hand, here a single **contract** is the source of truth: ts-rest validates requests against it and `mountTsRest` generates the OpenAPI 3.1 doc from it — the API, its validation, and its docs can't drift.

## What it shows

| Package | Usage |
|---|---|
| `api-ts-rest-express` | `initContract` / `initServer` to define the contract + handlers; `mountTsRest` to serve routes **and** the generated Scalar docs in one call |
| `api-ts-rest-express` → `withDefaultErrors` | Attaches the shared `400`/`404`/`500` error envelope to every route's responses |
| `api-config` | Load `PORT` + `LOG_LEVEL` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-errors` | `NotFoundError` + `toErrorResponse()` to return the shared error envelope from handlers |
| `api-errors-express` | `errorHandler` / `notFoundHandler` as the catch-all for unexpected throws and off-contract routes |
| `api-response` | `ok()` success envelope + `successSchema()` in the contract |
| `api-express-utils` | `logRoutes()` on startup |

## Routes

```
GET    /items
POST   /items      body: { "name": string }
GET    /items/:id
DELETE /items/:id
GET    /docs               Scalar API reference (generated from the contract)
GET    /openapi.json       OpenAPI 3.1 spec
```

## Run locally

```bash
cp .env.example .env
pnpm dev
# → http://localhost:3003
# → http://localhost:3003/docs   (Scalar)
```

## Run with Docker

```bash
docker compose up
# → http://localhost:3003
# → http://localhost:3003/docs   (Scalar)
```

## Quick smoke test

```bash
curl http://localhost:3003/items
curl -X POST http://localhost:3003/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"hello"}'
curl http://localhost:3003/items/bad-id   # → 404 (shared error envelope)
curl -X POST http://localhost:3003/items \
  -H 'Content-Type: application/json' \
  -d '{}'                                 # → 400 (ts-rest contract validation)
```

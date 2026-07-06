---
title: ts-rest Express example
description: Runnable contract-first Express 5 app built with ts-rest via api-ts-rest-express.
---

The `apps/example-ts-rest-express` directory contains a working Express 5 API
built **contract-first** with [ts-rest](https://ts-rest.com), via
[`@rtorcato/api-ts-rest-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-ts-rest-express).

Where the [Express example](./express.md) wires routes and the OpenAPI spec by
hand, here a single **contract** is the source of truth: ts-rest validates
requests against it and `mountTsRest` generates the OpenAPI 3.1 doc from it — so
the API, its validation, and its docs can't drift.

## What it demonstrates

| Package | Usage in the example |
|---|---|
| [`api-ts-rest-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-ts-rest-express) | `initContract` / `initServer` define the contract + handlers; `mountTsRest` serves the routes **and** the generated Scalar docs in one call |
| [`api-ts-rest-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-ts-rest-express) → `withDefaultErrors` | Attaches the shared `400`/`404`/`500` error envelope to every route's responses |
| [`api-config`](https://github.com/rtorcato/api-common/tree/main/packages/api-config) | `loadEnv()` validates `PORT` + `LOG_LEVEL` from `.env` at startup |
| [`api-logger`](https://github.com/rtorcato/api-common/tree/main/packages/api-logger) | `createLogger()` gives a pino logger, pretty-printed in dev |
| [`api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors) | `NotFoundError` + `toErrorResponse()` return the shared error envelope from handlers |
| [`api-errors-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-express) | `errorHandler` / `notFoundHandler` catch unexpected throws and off-contract routes |
| [`api-response`](https://github.com/rtorcato/api-common/tree/main/packages/api-response) | `ok()` success envelope + `successSchema()` in the contract |
| [`api-express-utils`](https://github.com/rtorcato/api-common/tree/main/packages/api-express-utils) | `logRoutes()` prints routes on start |

## Routes

```
GET    /items
POST   /items          { "name": string }
GET    /items/:id
DELETE /items/:id
GET    /docs           Scalar API reference (generated from the contract)
GET    /openapi.json   OpenAPI 3.1 spec
```

Items are stored in-memory — no database required.

## Run locally

```bash
cd apps/example-ts-rest-express
cp .env.example .env
pnpm dev
```

The server starts on `http://localhost:3003` with pretty-printed logs.

- Scalar API reference → `http://localhost:3003/docs`
- OpenAPI spec → `http://localhost:3003/openapi.json`

## Run with Docker

```bash
cd apps/example-ts-rest-express
docker compose up
```

The image builds from the monorepo root, installs workspace packages, and
starts the server on port `3003`.

## Quick smoke test

```bash
# List items (empty)
curl http://localhost:3003/items

# Create
curl -X POST http://localhost:3003/items \
  -H 'Content-Type: application/json' \
  -d '{"name":"hello"}'

# 404 for a bad ID — shared error envelope
curl http://localhost:3003/items/bad-id

# 400 validation error — ts-rest contract validation
curl -X POST http://localhost:3003/items \
  -H 'Content-Type: application/json' \
  -d '{}'
```

## Source

[`apps/example-ts-rest-express/src/index.ts`](https://github.com/rtorcato/api-common/tree/main/apps/example-ts-rest-express/src/index.ts)

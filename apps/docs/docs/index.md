---
title: api-common
description: One package of framework-agnostic building blocks for Node.js APIs, with errors, auth, rate limiting, validation, config, logging and OpenAPI docs as subpath exports, plus Express and Hono adapters.
sidebar_position: 0
---

# api-common

[![CI](https://github.com/rtorcato/api-common/actions/workflows/ci.yml/badge.svg)](https://github.com/rtorcato/api-common/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@rtorcato%2Fapi-common.svg)](https://badge.fury.io/js/@rtorcato%2Fapi-common)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato%2Fapi-common)](https://www.npmjs.com/package/@rtorcato/api-common)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-common/errors)](https://bundlephobia.com/package/@rtorcato/api-common)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

One ESM-only package of building blocks for Node.js APIs. Each feature is a subpath export, framework-agnostic where possible, with thin Express and Hono adapters. Third-party libraries are optional peer dependencies, so you install only what the subpaths you import need and control the versions.

```bash
pnpm add @rtorcato/api-common
```

- **[`errors`](./guides/api-errors.md)**: framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, and `InternalServerError`, each carrying a `status` and machine-readable `code`. The `errors/express` and `errors/hono` adapters (`errorHandler` + `notFoundHandler`) turn thrown errors into a consistent JSON response.
- **[`auth`](./guides/api-auth.md)**: JWT sign/verify/extract, with Express and Hono adapters for auth and optional-auth middleware.
- **[`rate-limit`](./guides/api-rate-limit.md)**: sliding-window rate limiter with Express and Hono middleware and a Redis store.
- **[`validation`](./guides/api-validation.md)**: zod request validation that throws a `BadRequestError` on failure.
- **[`response`](./guides/api-response.md)**: `ok()` success envelope, the counterpart to the error shape.
- **[`config`](./guides/api-config.md)**: load and validate env vars with dotenv + zod at startup.
- **[`logger`](./guides/api-logger.md)**: pino logger factory, pretty in dev and JSON in production.
- **[`openapi`](./guides/api-openapi.md)**: Scalar docs HTML generators, with Express and Hono adapters to serve them.
- **[`cors/express`](./guides/api-cors-express.md)** and **[`express-utils`](./guides/api-express-utils.md)**: CORS middleware and small Express helpers (client IP, route listing).

There are more subpaths for health checks, timeouts, webhooks, uploads, an HTTP client, graceful shutdown, AMQP, MCP and testing. The [API Reference](./api) lists them all.

The error adapters emit the **same** response body, so switching frameworks (or running
both) keeps your error contract identical:

```json
{ "error": "NotFoundError", "code": "not_found", "message": "User not found" }
```

The framework (`express` / `hono`) is an **optional peer dependency** of each adapter, so you
control the version. See [Optional peers](./guides/optional-peers.md), or
[Migrating](./guides/migration.md) if you used the old `@rtorcato/api-*` packages.

## Quick example

```ts
import { NotFoundError } from '@rtorcato/api-common/errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-common/errors/express'

app.get('/users/:id', (req, res) => {
	const user = db.find(req.params.id)
	if (!user) throw new NotFoundError('User not found')
	res.json(user)
})

app.use(notFoundHandler) // 404 for unmatched routes
app.use(errorHandler()) // maps thrown HttpErrors to JSON
```

Start with [Installation](./guides/installation.md), then the
[Express](./guides/express.md) or [Hono](./guides/hono.md) guide. The full
[API Reference](./api/errors/index.md) is generated from the source.

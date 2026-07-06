---
title: api-common
description: Framework-agnostic building blocks for Node.js APIs — errors, auth, rate limiting, validation, config, logging, and OpenAPI docs, with Express and Hono adapters.
sidebar_position: 0
---

# api-common

[![CI](https://github.com/rtorcato/api-common/actions/workflows/ci.yml/badge.svg)](https://github.com/rtorcato/api-common/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@rtorcato%2Fapi-errors.svg)](https://badge.fury.io/js/@rtorcato%2Fapi-errors)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato%2Fapi-errors)](https://www.npmjs.com/package/@rtorcato/api-errors)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-errors)](https://bundlephobia.com/package/@rtorcato/api-errors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A family of reusable packages for building Node.js APIs. Each is independently
consumable, framework-agnostic where possible, and ships thin Express and Hono
adapters as peer dependencies so you control the framework version.

- **[`@rtorcato/api-errors`](./guides/api-errors.md)** — framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, and `InternalServerError`, each carrying a `status` and machine-readable `code`. Express and Hono adapters (`errorHandler` + `notFoundHandler`) turn thrown errors into a consistent JSON response.
- **[`@rtorcato/api-auth`](./guides/api-auth.md)** — JWT sign/verify/extract, with an Express adapter for auth and optional-auth middleware.
- **[`@rtorcato/api-rate-limit`](./guides/api-rate-limit.md)** — in-memory sliding-window rate limiter with Express and Hono middleware.
- **[`@rtorcato/api-validation`](./guides/api-validation.md)** — zod request validation that throws a `BadRequestError` on failure.
- **[`@rtorcato/api-response`](./guides/api-response.md)** — `ok()` success envelope, the counterpart to the error shape.
- **[`@rtorcato/api-config`](./guides/api-config.md)** — load and validate env vars with dotenv + zod at startup.
- **[`@rtorcato/api-logger`](./guides/api-logger.md)** — pino logger factory: pretty in dev, JSON in production.
- **[`@rtorcato/api-openapi`](./guides/api-openapi.md)** — Swagger UI and Scalar HTML generators, with an Express adapter to serve them.
- **[`@rtorcato/api-cors-express`](./guides/api-cors-express.md)** and **[`@rtorcato/api-express-utils`](./guides/api-express-utils.md)** — CORS middleware and small Express helpers (client IP, route listing).

The error adapters emit the **same** response body, so switching frameworks (or running
both) keeps your error contract identical:

```json
{ "error": "NotFoundError", "code": "not_found", "message": "User not found" }
```

The framework (`express` / `hono`) is a **peer dependency** of each adapter — you
control the version.

## Quick example

```ts
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'

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
[API Reference](./api/api-errors/index.md) is generated from the package sources.

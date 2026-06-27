---
title: api-common
description: Framework-agnostic HTTP error classes plus Express and Hono middleware for Node.js APIs.
sidebar_position: 0
---

# api-common

A small family of reusable packages for building Node.js APIs. A framework-agnostic
core of HTTP error classes, plus thin middleware adapters for Express and Hono that
turn those errors into a consistent JSON response.

- **`@rtorcato/api-errors`** — framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, and `InternalServerError`. Each carries a `status` and a machine-readable `code`. No HTTP framework required.
- **`@rtorcato/api-errors-express`** — Express `errorHandler` + `notFoundHandler` middleware.
- **`@rtorcato/api-errors-hono`** — Hono `errorHandler` + `notFoundHandler` middleware.

Both adapters emit the **same** response body, so switching frameworks (or running
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

---
title: Hono middleware
description: Map @rtorcato/api-errors into JSON responses with the Hono adapter.
---

`@rtorcato/api-errors-hono` provides `errorHandler` and `notFoundHandler` that wire
into Hono's `app.onError` / `app.notFound`, producing the **same** response body as
the [Express adapter](./express.md).

## Install

```bash
pnpm add @rtorcato/api-errors @rtorcato/api-errors-hono hono
```

`hono` is a peer dependency (`^4`).

## Setup

Unlike the Express adapter, these plug into Hono's dedicated hooks:

```ts
import { Hono } from 'hono'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'

const app = new Hono()

app.get('/users/:id', (c) => {
	const user = db.find(c.req.param('id'))
	if (!user) throw new NotFoundError('User not found')
	return c.json(user)
})

app.notFound(notFoundHandler) // 404 for unmatched routes
app.onError(errorHandler()) // maps thrown HttpErrors to JSON

export default app
```

`notFoundHandler` throws a `NotFoundError`, which `onError` then renders — so both
unmatched routes and explicit throws share one code path and one response shape.

## Response shape

```json
{ "error": "NotFoundError", "code": "not_found", "message": "User not found" }
```

Non-`HttpError` throws become a `500` with `code: "internal_server_error"`, exactly
as in the Express adapter.

## Including the stack trace

```ts
app.onError(errorHandler({ includeStack: true }))
```

`includeStack` defaults to `true` only when `process.env.NODE_ENV === 'development'`,
adding a `stack` field to the body. Leave it off in production.

See the [API reference](../api/api-errors-hono/index.md) for the full
`ErrorHandlerOptions` type.

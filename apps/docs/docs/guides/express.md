---
title: Express middleware
description: Map @rtorcato/api-errors into JSON responses with the Express adapter.
---

`@rtorcato/api-errors-express` provides two middleware functions that turn thrown
`HttpError` instances into a consistent JSON response.

## Install

```bash
pnpm add @rtorcato/api-errors @rtorcato/api-errors-express express
```

`express` is a peer dependency (`^4.18 || ^5`) — you bring your own version.

## Setup

Register `notFoundHandler` after your routes, and `errorHandler()` last:

```ts
import express from 'express'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'

const app = express()

app.get('/users/:id', (req, res) => {
	const user = db.find(req.params.id)
	if (!user) throw new NotFoundError('User not found')
	res.json(user)
})

// 404 for any unmatched route
app.use(notFoundHandler)

// Must be registered last — Express identifies it as an error handler by arity
app.use(errorHandler())

app.listen(3000)
```

## Response shape

Any thrown `HttpError` is mapped to its `status` with this JSON body:

```json
{ "error": "NotFoundError", "code": "not_found", "message": "User not found" }
```

- `error` — the error's `name` (e.g. `NotFoundError`)
- `code` — the machine-readable `code` (e.g. `not_found`)
- `message` — the error message

Anything that **isn't** an `HttpError` becomes a `500` with
`code: "internal_server_error"` — so an unexpected throw never leaks a stack trace
or framework default page to the client.

:::note Async routes
On **Express 4**, errors thrown in `async` route handlers aren't caught
automatically — wrap them or use a library like `express-async-errors`. **Express 5**
forwards rejected promises to the error handler for you.
:::

## Including the stack trace

In development you may want the stack in the response. Pass `includeStack`:

```ts
app.use(errorHandler({ includeStack: true }))
```

When omitted, it defaults to `true` only when `process.env.NODE_ENV === 'development'`,
and adds a `stack` field to the body. Leave it off in production.

See the [API reference](../api/api-errors-express/index.md) for the full
`ErrorHandlerOptions` type.

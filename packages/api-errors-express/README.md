# @rtorcato/api-errors-express

Express middleware for [`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors): error handler + not-found handler.

## Install

```sh
pnpm add @rtorcato/api-errors @rtorcato/api-errors-express
pnpm add express
```

`express` is a peer dependency (`^4 || ^5`).

## Usage

```ts
import express from 'express'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'

const app = express()

app.get('/users/:id', (req, res, next) => {
  if (req.params.id !== '1') return next(new NotFoundError('No such user'))
  res.json({ id: '1' })
})

// Register AFTER all routes:
app.use(notFoundHandler)
app.use(errorHandler())

app.listen(3000)
```

### Response shape

For any thrown `HttpError` (or subclass), the error handler responds with:

```json
{
  "error": "NotFoundError",
  "code": "not_found",
  "message": "No such user"
}
```

Unknown errors map to `500` / `internal_server_error`.

### Options

```ts
errorHandler({ includeStack: true })
```

- `includeStack` — append `stack` to the response body. Defaults to `process.env.NODE_ENV === 'development'`.

## Related

- [`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors) — the framework-agnostic error classes
- [`@rtorcato/api-errors-hono`](https://www.npmjs.com/package/@rtorcato/api-errors-hono) — Hono adapter with the same response shape

Source + changelog: https://github.com/rtorcato/api-common/tree/main/packages/api-errors-express

# @rtorcato/api-errors-hono

Hono middleware for [`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors): error handler + not-found handler.

## Install

```sh
pnpm add @rtorcato/api-errors @rtorcato/api-errors-hono
pnpm add hono
```

`hono` is a peer dependency (`^4`).

## Usage

```ts
import { Hono } from 'hono'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'

const app = new Hono()

app.get('/users/:id', (c) => {
  if (c.req.param('id') !== '1') throw new NotFoundError('No such user')
  return c.json({ id: '1' })
})

app.notFound(notFoundHandler)
app.onError(errorHandler())

export default app
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

Unknown errors map to `500` / `internal_server_error`. The shape matches `@rtorcato/api-errors-express` so a frontend consumer sees the same payload regardless of framework.

### Options

```ts
errorHandler({ includeStack: true })
```

- `includeStack` — append `stack` to the response body. Defaults to `process.env.NODE_ENV === 'development'`.

## Related

- [`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors) — the framework-agnostic error classes
- [`@rtorcato/api-errors-express`](https://www.npmjs.com/package/@rtorcato/api-errors-express) — Express adapter with the same response shape

Source + changelog: https://github.com/rtorcato/api-common/tree/main/packages/api-errors-hono

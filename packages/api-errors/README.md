# @rtorcato/api-errors

Framework-agnostic HTTP error classes for Node.js APIs.

## Install

```sh
pnpm add @rtorcato/api-errors
```

## Usage

```ts
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@rtorcato/api-errors'

throw new NotFoundError('User not found', 'user_not_found')
// err.status  -> 404
// err.code    -> 'user_not_found'
// err.message -> 'User not found'
```

Every class extends `HttpError`, which extends `Error`. Each carries:

- `status` — HTTP status code (`number`)
- `code` — machine-readable error code (`string`)
- `message` — human-readable message (inherited from `Error`)

### Available classes

| Class | Status | Default code |
| --- | --- | --- |
| `BadRequestError` | 400 | `bad_request` |
| `UnauthorizedError` | 401 | `unauthorized` |
| `ForbiddenError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `UnprocessableEntityError` | 422 | `unprocessable_entity` |
| `TooManyRequestsError` | 429 | `too_many_requests` |
| `InternalServerError` | 500 | `internal_server_error` |
| `ServiceUnavailableError` | 503 | `service_unavailable` |

`HttpError` itself is also exported for custom statuses:

```ts
throw new HttpError(429, 'Too many requests', 'rate_limited')
```

## Related

- [`@rtorcato/api-errors-express`](https://www.npmjs.com/package/@rtorcato/api-errors-express) — Express middleware adapter
- [`@rtorcato/api-errors-hono`](https://www.npmjs.com/package/@rtorcato/api-errors-hono) — Hono middleware adapter

Source + changelog: https://github.com/rtorcato/api-common/tree/main/packages/api-errors

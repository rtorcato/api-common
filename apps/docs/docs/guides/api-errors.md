---
title: api-errors
description: HTTP error classes for Node.js APIs — framework-agnostic, consistent error shapes.
---

`@rtorcato/api-errors` provides typed HTTP error classes that pair with the Express and Hono error-handler middleware.

## Install

```bash
pnpm add @rtorcato/api-errors
```

## Error classes

| Class | Status | Default code |
|-------|--------|-------------|
| `BadRequestError` | 400 | `bad_request` |
| `UnauthorizedError` | 401 | `unauthorized` |
| `ForbiddenError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `UnprocessableEntityError` | 422 | `unprocessable_entity` |
| `TooManyRequestsError` | 429 | `too_many_requests` |
| `InternalServerError` | 500 | `internal_server_error` |
| `ServiceUnavailableError` | 503 | `service_unavailable` |

All extend `HttpError`, which extends `Error`.

## Usage

```ts
import { NotFoundError, ForbiddenError } from '@rtorcato/api-errors'

// Default message and code
throw new NotFoundError()
// → { status: 404, code: 'not_found', message: 'Not Found' }

// Custom message
throw new NotFoundError('User 42 not found')
// → { status: 404, code: 'not_found', message: 'User 42 not found' }

// Custom message + code
throw new ForbiddenError('Trial expired', 'trial_expired')
// → { status: 403, code: 'trial_expired', message: 'Trial expired' }
```

## Wire up the error handler

Throw from anywhere in your route — the error handler converts it to JSON automatically.

**Express** (`@rtorcato/api-errors-express`):

```ts
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'

app.use(notFoundHandler)   // catch unmatched routes
app.use(errorHandler())    // convert HttpErrors to JSON
```

**Hono** (`@rtorcato/api-errors-hono`):

```ts
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'

app.notFound(notFoundHandler)
app.onError(errorHandler())
```

## Error response shape

```json
{
  "error": "NotFoundError",
  "code": "not_found",
  "message": "User 42 not found"
}
```

`error` is the class name. `code` is machine-readable and stable — safe to switch on in clients.

## Custom errors

Extend `HttpError` for domain-specific errors:

```ts
import { HttpError } from '@rtorcato/api-errors'

export class PaymentRequiredError extends HttpError {
  constructor(message = 'Payment required') {
    super(402, message, 'payment_required')
    this.name = 'PaymentRequiredError'
  }
}
```

Throw it like any other — the error handler picks it up automatically because it's still an `HttpError`.

See [Custom errors](./custom-errors.md) for a fuller guide.

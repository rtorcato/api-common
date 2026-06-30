---
title: Custom errors
description: Extend HttpError for domain-specific error types.
---

The built-in error classes cover standard HTTP status codes. For domain-specific errors, extend `HttpError` directly.

## Pattern

```ts
import { HttpError } from '@rtorcato/api-errors'

export class PaymentRequiredError extends HttpError {
  constructor(message = 'Payment required') {
    super(402, message, 'payment_required')
    this.name = 'PaymentRequiredError'
  }
}

export class TenantNotFoundError extends HttpError {
  constructor(tenantId: string) {
    super(404, `Tenant ${tenantId} not found`, 'tenant_not_found')
    this.name = 'TenantNotFoundError'
  }
}
```

Throw them like any other error — the `errorHandler()` middleware catches any `HttpError` subclass and serialises it:

```ts
throw new TenantNotFoundError(req.params.tenantId)
```

Response:

```json
{
  "error": "TenantNotFoundError",
  "code": "tenant_not_found",
  "message": "Tenant abc not found"
}
```

## Rules

- **Always set `this.name`** to the class name — it's the `error` field in the JSON response.
- **Use a stable `code` string** — this is what clients switch on. Use `snake_case` and never rename it once deployed.
- **Default messages are optional** — if the message always carries runtime data (like an ID), skip the default.

## Where to put them

Keep custom errors close to where they're thrown — e.g. `src/errors.ts` in your app, or a shared `errors` package if multiple services use them.

## Type narrowing

`instanceof` works for error-handling logic outside the middleware:

```ts
import { HttpError } from '@rtorcato/api-errors'
import { TenantNotFoundError } from './errors.js'

try {
  await doSomething()
} catch (err) {
  if (err instanceof TenantNotFoundError) {
    // tenant-specific recovery
  } else if (err instanceof HttpError) {
    // generic HTTP error
  } else {
    throw err  // re-throw unknowns
  }
}
```

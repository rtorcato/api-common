---
title: api-timeout
description: Framework-agnostic per-request timeout with Express and Hono adapters.
---

`@rtorcato/api-timeout` races a promise against a deadline. If the deadline elapses first it rejects with a `ServiceUnavailableError` (503) from [api-errors](./api-errors.md); otherwise it passes through the promise's own result. Use it directly, or drop in the Express or Hono adapter middleware.

## Install

```bash
# Core (agnostic)
pnpm add @rtorcato/api-timeout

# Framework adapters (pick one or both)
pnpm add @rtorcato/api-timeout-express
pnpm add @rtorcato/api-timeout-hono
```

## Using the core helper

```ts
import { withTimeout } from '@rtorcato/api-timeout'

// Resolves with the fetch result, or rejects with a 503 after 2s.
const user = await withTimeout(fetchUser(id), 2000)
```

The timer is always cleared, so a promise that settles first leaves nothing dangling.

## Express middleware

```ts
import { timeoutMiddleware } from '@rtorcato/api-timeout-express'

// Any request not answered within 5s gets a 503 error envelope.
app.use(timeoutMiddleware({ ms: 5000 }))
```

## Hono middleware

```ts
import { timeoutMiddleware } from '@rtorcato/api-timeout-hono'

app.use(timeoutMiddleware({ ms: 5000 }))
```

## Notes

- On timeout the losing promise **keeps running** — JavaScript has no cancellation. Its result is discarded; make the wrapped work idempotent or abortable if that matters.
- The middleware responds with the standard error envelope `{ error: 'ServiceUnavailableError', code: 'service_unavailable', message }`.

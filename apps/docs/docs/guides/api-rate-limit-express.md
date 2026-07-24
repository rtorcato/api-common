---
title: api-rate-limit-express
description: Express middleware for the api-rate-limit sliding-window limiter.
---

`@rtorcato/api-rate-limit-express` is the Express adapter for
[api-rate-limit](./api-rate-limit.md). It applies a sliding-window limit per client
and responds `429` when the limit is exceeded.

## Install

```bash
pnpm add @rtorcato/api-rate-limit @rtorcato/api-rate-limit-express express
```

`express` is a peer dependency — you bring your own version.

## Usage

Pass a `store` — `memoryStore()` for a single process, or [`redisStore()`](./api-rate-limit-redis.md)
to share limits across instances.

```ts
import { memoryStore } from '@rtorcato/api-rate-limit'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'

app.use(rateLimitMiddleware({
  requests: 100,     // max requests per key
  windowMs: 60_000,  // sliding window: 1 minute
  store: memoryStore(),
}))
```

Keys on the client IP via `X-Forwarded-For`. When the limit is exceeded it responds
`429` with the standard error envelope `{ error: 'TooManyRequestsError', code:
'too_many_requests', message }` from [api-errors](./api-errors.md).

## Per-route limits

Apply a tighter limit to specific routes instead of globally:

```ts
const authLimiter = rateLimitMiddleware({ requests: 10, windowMs: 60_000, store: memoryStore() })
app.use('/auth', authLimiter)
```

## Related

- [api-rate-limit](./api-rate-limit.md) — framework-agnostic core (stores, limits, sliding window)
- [api-rate-limit-redis](./api-rate-limit-redis.md) — Redis store for limits shared across instances
- [api-rate-limit-hono](./api-rate-limit-hono.md) — the Hono adapter

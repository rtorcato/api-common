---
title: api-rate-limit
description: In-memory sliding-window rate limiter with Express and Hono adapters.
---

`@rtorcato/api-rate-limit` is a framework-agnostic sliding-window rate limiter. Use it directly, or drop in the Express or Hono adapter middleware.

## Install

```bash
# Core (agnostic)
pnpm add @rtorcato/api-rate-limit

# Framework adapters (pick one or both)
pnpm add @rtorcato/api-rate-limit-express
pnpm add @rtorcato/api-rate-limit-hono
```

## Express middleware

```ts
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'

app.use(rateLimitMiddleware({
  requests: 100,       // max requests per key
  windowMs: 60_000,   // sliding window: 1 minute
}))
```

Responds with `429 Too Many Requests` when the limit is exceeded.

## Hono middleware

```ts
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-hono'

app.use(rateLimitMiddleware({
  requests: 100,
  windowMs: 60_000,
}))
```

## Per-route limits

Apply middleware to specific routes instead of globally:

```ts
// Express — tighter limit on auth endpoints
const authLimiter = rateLimitMiddleware({ requests: 10, windowMs: 60_000 })
app.use('/auth', authLimiter)

// Hono
app.use('/auth/*', rateLimitMiddleware({ requests: 10, windowMs: 60_000 }))
```

## Using the core limiter directly

```ts
import { createRateLimiter } from '@rtorcato/api-rate-limit'

const limiter = createRateLimiter({ requests: 50, windowMs: 60_000 })

const result = limiter.check('user-123')
if (!result.allowed) {
  // reject the request
}
// result.remaining — requests left in the current window
```

The key is any string — typically an IP address, user ID, or API key.

## Sliding window

Each call to `check(key)` records a timestamp. The window slides forward with each request — old timestamps outside `windowMs` are dropped. This avoids the burst at window boundaries that fixed-window rate limiters allow.

## Limitations

- **In-memory, single-process only.** Limits are not shared across multiple server instances. For distributed rate limiting, wrap a shared store (e.g. Redis) behind the same `RateLimiter` interface.
- The limiter sweeps stale keys every 1000 operations to prevent unbounded memory growth from one-off IP addresses.

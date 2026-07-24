---
title: api-rate-limit
description: Sliding-window rate limiter with a pluggable store (in-memory or Redis) and Express and Hono adapters.
---

`@rtorcato/api-rate-limit` is a framework-agnostic sliding-window rate limiter with a **pluggable store**. Use it directly, or drop in the Express or Hono adapter middleware.

## Install

```bash
# Core (agnostic) — includes memoryStore()
pnpm add @rtorcato/api-rate-limit

# Shared store for multi-instance deployments
pnpm add @rtorcato/api-rate-limit-redis ioredis

# Framework adapters (pick one or both)
pnpm add @rtorcato/api-rate-limit-express
pnpm add @rtorcato/api-rate-limit-hono
```

## Choosing a store

`store` is **required** — there is no default. A silent in-memory default is wrong across replicas: each process keeps its own counts, so behind N instances the effective limit becomes N× what you configured.

| Store | Package | Use when |
|---|---|---|
| `memoryStore()` | `@rtorcato/api-rate-limit` | Single process, local dev, tests |
| `redisStore(client)` | [`@rtorcato/api-rate-limit-redis`](./api-rate-limit-redis.md) | Limits must hold across multiple instances |

Both implement the same `RateLimitStore` interface, so swapping them touches only the `store` value.

## Express middleware

```ts
import { memoryStore } from '@rtorcato/api-rate-limit'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'

app.use(rateLimitMiddleware({
  requests: 100,       // max requests per key
  windowMs: 60_000,    // sliding window: 1 minute
  store: memoryStore(),
}))
```

Responds with `429 Too Many Requests` when the limit is exceeded.

## Hono middleware

```ts
import { memoryStore } from '@rtorcato/api-rate-limit'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-hono'

app.use(rateLimitMiddleware({
  requests: 100,
  windowMs: 60_000,
  store: memoryStore(),
}))
```

## Per-route limits

Apply middleware to specific routes instead of globally:

```ts
// Express — tighter limit on auth endpoints
const authLimiter = rateLimitMiddleware({ requests: 10, windowMs: 60_000, store: memoryStore() })
app.use('/auth', authLimiter)

// Hono
app.use('/auth/*', rateLimitMiddleware({ requests: 10, windowMs: 60_000, store: memoryStore() }))
```

## Using the core limiter directly

`check()` and `reset()` are async — a networked store can't be synchronous.

```ts
import { createRateLimiter, memoryStore } from '@rtorcato/api-rate-limit'

const limiter = createRateLimiter({ requests: 50, windowMs: 60_000, store: memoryStore() })

const result = await limiter.check('user-123')
if (!result.allowed) {
  // reject the request
}
// result.remaining — requests left in the current window
```

The key is any string — typically an IP address, user ID, or API key.

## Sliding window

Each call to `check(key)` records a timestamp. The window slides forward with each request — old timestamps outside `windowMs` are dropped. This avoids the burst at window boundaries that fixed-window rate limiters allow.

## Custom stores

Back the limiter with any store by implementing `RateLimitStore`:

```ts
interface RateLimitStore {
  hit(key: string, opts: { windowMs: number; limit: number }): Promise<RateLimitResult>
  reset(): Promise<void>
}
```

The window/limit are passed per call, so one store instance can back many limiters with different windows.

## Notes

- **`memoryStore()` is single-process only** — counts aren't shared across instances. Use [`redisStore()`](./api-rate-limit-redis.md) for distributed limits.
- `memoryStore()` sweeps stale keys every 1000 operations to prevent unbounded memory growth from one-off IP addresses.

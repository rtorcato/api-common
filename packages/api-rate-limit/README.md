# @rtorcato/api-rate-limit

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-rate-limit.svg)](https://www.npmjs.com/package/@rtorcato/api-rate-limit)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-rate-limit.svg)](https://www.npmjs.com/package/@rtorcato/api-rate-limit)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-rate-limit)](https://bundlephobia.com/package/@rtorcato/api-rate-limit)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic sliding-window rate limiter with a pluggable store.

```ts
import { createRateLimiter, memoryStore } from '@rtorcato/api-rate-limit'

const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store: memoryStore() })

const { allowed, remaining } = await limiter.check(clientIp)
if (!allowed) return respond429()
```

## Choosing a store

`store` is **required** — there's no default, on purpose. A silent in-memory
default is wrong across replicas: each process keeps its own counts, so behind
N instances the effective limit becomes N× what you configured. Pick a store
that matches your deployment:

- **`memoryStore()`** (this package) — single-process/dev/tests. Fast, no deps.
- **`redisStore()`** ([`@rtorcato/api-rate-limit-redis`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit-redis)) — counts shared across every instance pointing at the same Redis.

Both satisfy the same `RateLimitStore` interface, so you can swap them without
touching call sites.

## API

### `createRateLimiter({ requests, windowMs, store })`

Returns a `RateLimiter`:

- `check(key)` — records a hit for `key` and resolves `{ allowed, remaining }`. **async**
- `reset()` — drops all tracked keys. **async**

The key is any string — typically an IP address, user ID, or API key.

### `memoryStore()`

An in-memory sliding-window (log) `RateLimitStore`. Stale keys are swept
periodically so the internal map stays bounded — the leak the naive
`Map`-per-IP middleware had. Single-process only.

### `RateLimitStore`

Implement this to back the limiter with any store:

```ts
interface RateLimitStore {
  hit(key: string, opts: { windowMs: number; limit: number }): Promise<RateLimitResult>
  reset(): Promise<void>
}
```

The window/limit are passed per call (not bound at construction), so one store
instance — e.g. a shared Redis connection — can back many limiters with
different windows.

## License

MIT

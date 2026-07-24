---
"@rtorcato/api-rate-limit": major
"@rtorcato/api-rate-limit-express": major
"@rtorcato/api-rate-limit-hono": major
"@rtorcato/api-rate-limit-redis": minor
---

Pluggable rate-limit store + async `check` (closes #199)

`@rtorcato/api-rate-limit` no longer ships a silent in-memory default — an
in-memory default is wrong across replicas, where each process keeps its own
counts and the effective limit becomes N× the configured value.

**Breaking:**

- `createRateLimiter({ requests, windowMs, store })` now **requires** a `store`.
  Pass `memoryStore()` (single-process/dev/tests) or `redisStore()` from the new
  `@rtorcato/api-rate-limit-redis` package (limits shared across instances).
- `check()` and `reset()` are now **async** (`Promise`-returning) — a networked
  store can't be synchronous. `await limiter.check(key)`.
- The Express and Hono middlewares (`rateLimitMiddleware`) now require `store` in
  their options and `await` the check.

**New:** `@rtorcato/api-rate-limit-redis` — a `redisStore(ioredisClient, { prefix })`
that counts via an atomic Lua sliding-window over a Redis sorted set, so limits
hold across every instance. `ioredis` is a peer dependency.

Migration:

```ts
// before
const limiter = createRateLimiter({ requests: 100, windowMs: 60_000 })
const { allowed } = limiter.check(ip)

// after — single process
import { createRateLimiter, memoryStore } from '@rtorcato/api-rate-limit'
const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store: memoryStore() })
const { allowed } = await limiter.check(ip)

// after — shared across instances
import { redisStore } from '@rtorcato/api-rate-limit-redis'
const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store: redisStore(redis) })
```

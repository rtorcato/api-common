# @rtorcato/api-rate-limit-redis

Redis-backed store for [`@rtorcato/api-rate-limit`](../api-rate-limit). Counts
live in Redis, so a sliding-window limit holds across every instance pointing at
the same server — unlike the in-memory `memoryStore()`, where each replica keeps
its own counts and the effective limit becomes N× the configured value.

## Install

```sh
pnpm add @rtorcato/api-rate-limit @rtorcato/api-rate-limit-redis ioredis
```

`ioredis` is a peer dependency — you own the connection and its version.

## Usage

```ts
import Redis from 'ioredis'
import { createRateLimiter } from '@rtorcato/api-rate-limit'
import { redisStore } from '@rtorcato/api-rate-limit-redis'

const store = redisStore(new Redis(process.env.REDIS_URL))
const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store })

const { allowed, remaining } = await limiter.check(ip)
if (!allowed) {
	// reject with 429
}
```

Works the same behind the Express and Hono adapters — pass `store` in the
middleware options:

```ts
app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000, store }))
```

## Options

```ts
redisStore(client, { prefix = 'ratelimit:' })
```

- **`prefix`** — namespaces keys so they don't collide with other Redis data.
  Keep it isolated: `reset()` deletes every key under this prefix.

## How it works

Each key is a sorted set of hit timestamps. Every `hit()` runs one atomic Lua
script that drops expired entries, counts what's left, and records the hit only
if it's under the limit — so counting is correct even when many instances hit
Redis concurrently. Keys carry a `PEXPIRE` equal to the window, so idle keys
clean themselves up.

`reset()` is for tests and manual resets; it `SCAN`s and deletes every key under
the prefix. Don't call it on a hot path.

# @rtorcato/api-rate-limit

Framework-agnostic in-memory sliding-window rate limiter.

```ts
import { createRateLimiter } from '@rtorcato/api-rate-limit'

const limiter = createRateLimiter({ requests: 100, windowMs: 60_000 })

const { allowed, remaining } = limiter.check(clientIp)
if (!allowed) return respond429()
```

## API

### `createRateLimiter({ requests, windowMs })`

Returns a `RateLimiter`:

- `check(key)` — records a hit for `key` and returns
  `{ allowed, remaining }`.
- `reset()` — drops all tracked keys.

Stale keys are swept periodically so the internal map stays bounded — the leak
the naive `Map`-per-IP middleware had.

> In-memory and single-process. For limits shared across multiple instances,
> put the same `check` interface in front of a shared store (e.g. Redis).

## License

MIT

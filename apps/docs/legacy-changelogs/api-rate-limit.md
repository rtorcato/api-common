# @rtorcato/api-rate-limit

## 2.0.0

### Major Changes

- 66af10c: Pluggable rate-limit store + async `check` (closes #199)

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
  const limiter = createRateLimiter({ requests: 100, windowMs: 60_000 });
  const { allowed } = limiter.check(ip);

  // after — single process
  import { createRateLimiter, memoryStore } from "@rtorcato/api-rate-limit";
  const limiter = createRateLimiter({
    requests: 100,
    windowMs: 60_000,
    store: memoryStore(),
  });
  const { allowed } = await limiter.check(ip);

  // after — shared across instances
  import { redisStore } from "@rtorcato/api-rate-limit-redis";
  const limiter = createRateLimiter({
    requests: 100,
    windowMs: 60_000,
    store: redisStore(redis),
  });
  ```

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

## 0.1.0

### Minor Changes

- be7810d: Add four packages seeded from the api-starter reference app:

  - `@rtorcato/api-logger` — framework-agnostic pino logger factory.
  - `@rtorcato/api-validation` — zod request validation that throws `BadRequestError`, plus `formatZodError`.
  - `@rtorcato/api-config` — `loadEnv(schema)` for dotenv + zod env validation (throws instead of `process.exit`).
  - `@rtorcato/api-rate-limit` — in-memory sliding-window limiter with bounded memory.

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

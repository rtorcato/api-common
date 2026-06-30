# @rtorcato/api-logger

## 0.1.0

### Minor Changes

- be7810d: Add four packages seeded from the api-starter reference app:

  - `@rtorcato/api-logger` — framework-agnostic pino logger factory.
  - `@rtorcato/api-validation` — zod request validation that throws `BadRequestError`, plus `formatZodError`.
  - `@rtorcato/api-config` — `loadEnv(schema)` for dotenv + zod env validation (throws instead of `process.exit`).
  - `@rtorcato/api-rate-limit` — in-memory sliding-window limiter with bounded memory.

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

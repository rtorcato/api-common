# @rtorcato/api-config

## 0.2.0

### Minor Changes

- 7495730: Update the `zod` peer dependency range from `^3.23.0` to `^4.0.0`. These packages are developed and tested against Zod 4 (which is what the workspace resolves); the old `^3.23.0` peer no longer matched reality. Consumers still on Zod 3 should upgrade to Zod 4.

## 0.1.0

### Minor Changes

- be7810d: Add four packages seeded from the api-starter reference app:

  - `@rtorcato/api-logger` — framework-agnostic pino logger factory.
  - `@rtorcato/api-validation` — zod request validation that throws `BadRequestError`, plus `formatZodError`.
  - `@rtorcato/api-config` — `loadEnv(schema)` for dotenv + zod env validation (throws instead of `process.exit`).
  - `@rtorcato/api-rate-limit` — in-memory sliding-window limiter with bounded memory.

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

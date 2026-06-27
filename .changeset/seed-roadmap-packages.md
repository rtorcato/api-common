---
"@rtorcato/api-logger": minor
"@rtorcato/api-validation": minor
"@rtorcato/api-config": minor
"@rtorcato/api-rate-limit": minor
---

Add four packages seeded from the api-starter reference app:

- `@rtorcato/api-logger` — framework-agnostic pino logger factory.
- `@rtorcato/api-validation` — zod request validation that throws `BadRequestError`, plus `formatZodError`.
- `@rtorcato/api-config` — `loadEnv(schema)` for dotenv + zod env validation (throws instead of `process.exit`).
- `@rtorcato/api-rate-limit` — in-memory sliding-window limiter with bounded memory.

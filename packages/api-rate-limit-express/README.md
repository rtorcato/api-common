# @rtorcato/api-rate-limit-express

Express middleware for `@rtorcato/api-rate-limit` — sliding-window rate limiter.

## Install

```sh
pnpm add @rtorcato/api-rate-limit @rtorcato/api-rate-limit-express
```

`express` is a peer dependency — you bring your own version.

## Usage

```ts
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-express'

app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000 }))
```

Responds `429` with the standard error envelope `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }` when the limit is exceeded. Keys on client IP via `X-Forwarded-For`.

## Related

- [`@rtorcato/api-rate-limit`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit) — framework-agnostic core
- [`@rtorcato/api-rate-limit-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit-hono) — Hono adapter

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-rate-limit-express

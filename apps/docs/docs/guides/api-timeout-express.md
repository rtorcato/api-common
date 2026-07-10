---
title: api-timeout-express
description: Express middleware for the api-timeout per-request deadline.
---

`@rtorcato/api-timeout-express` is the Express adapter for
[api-timeout](./api-timeout.md). It fails a request with `503` if the response
isn't sent within a deadline.

## Install

```bash
pnpm add @rtorcato/api-timeout @rtorcato/api-timeout-express express
```

`express` is a peer dependency (`^4.18 || ^5`) — you bring your own version.

## Usage

```ts
import { timeoutMiddleware } from '@rtorcato/api-timeout-express'

// Any request not answered within 5s gets a 503 error envelope.
app.use(timeoutMiddleware({ ms: 5000 }))
```

On timeout it responds `503` with the standard error envelope
`{ error: 'ServiceUnavailableError', code: 'service_unavailable', message }` from
[api-errors](./api-errors.md). If the handler responds first, the timer is
cleared and nothing extra is sent.

:::warning
The middleware sends the 503 and stops. A slow handler that later tries to write
will hit Express's "headers already sent" — guard late writes with
`res.headersSent` in long-running handlers.
:::

## Related

- [api-timeout](./api-timeout.md) — framework-agnostic core (`withTimeout`, notes)
- [api-timeout-hono](./api-timeout-hono.md) — the Hono adapter

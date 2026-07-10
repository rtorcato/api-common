---
title: api-timeout-hono
description: Hono middleware for the api-timeout per-request deadline.
---

`@rtorcato/api-timeout-hono` is the Hono adapter for
[api-timeout](./api-timeout.md). It fails a request with `503` if downstream
handlers don't finish within a deadline.

## Install

```bash
pnpm add @rtorcato/api-timeout @rtorcato/api-timeout-hono hono
```

`hono` is a peer dependency (`^4`) — you bring your own version.

## Usage

```ts
import { timeoutMiddleware } from '@rtorcato/api-timeout-hono'

// Any request not answered within 5s gets a 503 error envelope.
app.use(timeoutMiddleware({ ms: 5000 }))
```

On timeout it responds `503` with the standard error envelope
`{ error: 'ServiceUnavailableError', code: 'service_unavailable', message }` from
[api-errors](./api-errors.md). Non-timeout errors bubble up to Hono's `onError`
unchanged.

## Related

- [api-timeout](./api-timeout.md) — framework-agnostic core (`withTimeout`, notes)
- [api-timeout-express](./api-timeout-express.md) — the Express adapter

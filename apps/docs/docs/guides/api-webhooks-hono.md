---
title: api-webhooks-hono
description: Hono webhook middleware — HMAC signature verification over the raw body.
---

`@rtorcato/api-webhooks-hono` is the Hono adapter for
[api-webhooks](./api-webhooks.md). It verifies the HMAC signature over the **raw**
request body.

## Install

```bash
pnpm add @rtorcato/api-webhooks @rtorcato/api-webhooks-hono hono
```

`hono` is a peer dependency (`^4`) — you bring your own version.

## Usage

```ts
import { webhookMiddleware } from '@rtorcato/api-webhooks-hono'

// GitHub-style webhook: header `x-hub-signature-256: sha256=<hmac>`
app.post('/webhooks/github', webhookMiddleware({
  secret: env.WEBHOOK_SECRET,
  header: 'x-hub-signature-256',
  prefix: 'sha256=',
}), async (c) => {
  const payload = await c.req.json() // body is buffered; safe to read here
  return c.body(null, 204)
})
```

On a missing/invalid signature it responds `401` with the standard error
envelope from [api-errors](./api-errors.md). Hono buffers the request body, so
the downstream handler can still call `c.req.json()` after the middleware reads
it as text.

## Related

- [api-webhooks](./api-webhooks.md) — framework-agnostic core (`sign`, `verifySignature`)
- [api-webhooks-express](./api-webhooks-express.md) — the Express adapter

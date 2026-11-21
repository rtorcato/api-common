---
title: api-webhooks
description: Framework-agnostic webhook HMAC signature verification with Express and Hono adapters.
---

`@rtorcato/api-common/webhooks` verifies inbound webhook signatures with a timing-safe
HMAC comparison. Use the core helpers directly, or drop in the Express or Hono
adapter middleware.

## Install

```bash
# Core (agnostic)
pnpm add @rtorcato/api-common

# Framework adapters (pick one or both)
pnpm add @rtorcato/api-common express
pnpm add @rtorcato/api-common hono
```

## Core helpers

```ts
import { sign, verifySignature } from '@rtorcato/api-common/webhooks'

// GitHub-style header: `x-hub-signature-256: sha256=<hmac>`
const ok = verifySignature(rawBody, signatureHeader, secret, { prefix: 'sha256=' })

// Produce a signature (e.g. for testing or outbound webhooks):
const sig = sign(rawBody, secret, { prefix: 'sha256=' })
```

- `sign(payload, secret, options?)` — hex HMAC of the raw payload. Options:
  `algorithm` (default `'sha256'`), `prefix` (default `''`).
- `verifySignature(payload, signature, secret, options?)` — timing-safe check.
  Returns `false` (never throws) on a missing or length-mismatched signature.

:::warning
Always verify the **raw** request body, not a re-serialized object — JSON
re-serialization changes bytes and breaks the signature. The Express adapter
preserves the raw body for you.
:::

## Express middleware

```ts
import { webhookMiddleware } from '@rtorcato/api-common/webhooks/express'

app.post('/webhooks/github', webhookMiddleware({
  secret: env.WEBHOOK_SECRET,
  header: 'x-hub-signature-256',
  prefix: 'sha256=',
}), (req, res) => res.sendStatus(204))
```

## Hono middleware

```ts
import { webhookMiddleware } from '@rtorcato/api-common/webhooks/hono'

app.post('/webhooks/github', webhookMiddleware({
  secret: env.WEBHOOK_SECRET,
  header: 'x-hub-signature-256',
  prefix: 'sha256=',
}), async (c) => c.body(null, 204))
```

Both adapters respond `401` with the standard `@rtorcato/api-common/errors` envelope on
a missing or invalid signature.

# @rtorcato/api-webhooks-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-webhooks-express.svg)](https://www.npmjs.com/package/@rtorcato/api-webhooks-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-webhooks-express.svg)](https://www.npmjs.com/package/@rtorcato/api-webhooks-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express webhook middleware for [api-webhooks](https://www.npmjs.com/package/@rtorcato/api-webhooks).
Captures the **raw** request body, verifies its HMAC signature, then parses the
JSON onto `req.body`.

## Install

```bash
pnpm add @rtorcato/api-webhooks @rtorcato/api-webhooks-express express
```

`express` is a peer dependency (`^4.18 || ^5`) — you bring your own version.

## Usage

```ts
import { webhookMiddleware } from '@rtorcato/api-webhooks-express'

// GitHub-style webhook: header `x-hub-signature-256: sha256=<hmac>`
app.post('/webhooks/github', webhookMiddleware({
  secret: env.WEBHOOK_SECRET,
  header: 'x-hub-signature-256',
  prefix: 'sha256=',
}), (req, res) => {
  // req.body is the parsed, signature-verified payload
  res.sendStatus(204)
})
```

Mount it as the route's middleware **before** any `express.json()` — that parser
consumes the raw body needed to verify the signature. On a missing/invalid
signature it responds `401`; on an unparseable body, `400`, using the standard
error envelope from [api-errors](./api-errors.md).

## Related

- [api-webhooks](./api-webhooks.md) — framework-agnostic `sign` / `verifySignature`
- [api-webhooks-hono](./api-webhooks-hono.md) — the Hono adapter

## License

MIT

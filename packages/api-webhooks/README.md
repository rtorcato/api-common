# @rtorcato/api-webhooks

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-webhooks.svg)](https://www.npmjs.com/package/@rtorcato/api-webhooks)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-webhooks.svg)](https://www.npmjs.com/package/@rtorcato/api-webhooks)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-webhooks)](https://bundlephobia.com/package/@rtorcato/api-webhooks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic webhook signature verification (HMAC) with timing-safe
comparison. Use it directly, or drop in the Express or Hono adapter middleware.

```ts
import { verifySignature } from '@rtorcato/api-webhooks'

// GitHub-style: header `x-hub-signature-256: sha256=<hmac>`.
const ok = verifySignature(rawBody, req.header('x-hub-signature-256'), secret, {
  prefix: 'sha256=',
})
```

## API

### `sign(payload, secret, options?)`

Compute the hex HMAC signature for a raw payload. `options`: `algorithm`
(default `'sha256'`), `prefix` (default `''`).

### `verifySignature(payload, signature, secret, options?)`

Timing-safe check that `signature` is a valid HMAC of `payload`. Returns
`false` (never throws) on a missing or length-mismatched signature.

> Always verify the **raw** request body, not a re-serialized object — JSON
> re-serialization changes bytes and breaks the signature. The Express adapter
> preserves the raw body for you.

## Adapters

- [`@rtorcato/api-webhooks-express`](https://www.npmjs.com/package/@rtorcato/api-webhooks-express)
- [`@rtorcato/api-webhooks-hono`](https://www.npmjs.com/package/@rtorcato/api-webhooks-hono)

## License

MIT

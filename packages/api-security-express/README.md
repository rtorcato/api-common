# @rtorcato/api-security-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-security-express.svg)](https://www.npmjs.com/package/@rtorcato/api-security-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-security-express.svg)](https://www.npmjs.com/package/@rtorcato/api-security-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-security-express)](https://bundlephobia.com/package/@rtorcato/api-security-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express security-headers middleware — a thin [helmet](https://helmetjs.github.io/)
wrapper that applies its full, sane default header suite under the
`@rtorcato/api-*` naming.

Hono ships [`secureHeaders`](https://hono.dev/docs/middleware/builtin/secure-headers)
built in, so this adapter is Express-only.

## Install

```sh
pnpm add @rtorcato/api-security-express
```

## Usage

```ts
import { securityMiddleware } from '@rtorcato/api-security-express'

// helmet's secure defaults.
app.use(securityMiddleware())

// Serving HTML with a custom Content-Security-Policy? Pass helmet options through.
app.use(securityMiddleware({
  contentSecurityPolicy: { directives: { 'script-src': ["'self'"] } },
}))
```

Called with no arguments, it applies helmet's full default suite:
`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`,
`Referrer-Policy`, `Strict-Transport-Security`, a default
`Content-Security-Policy`, and more. Any [helmet option](https://helmetjs.github.io/)
you pass is forwarded verbatim.

`express` is a peer dependency (v4 or v5) — you control the version.

## License

MIT

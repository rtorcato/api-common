# @rtorcato/api-security-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-security-express.svg)](https://www.npmjs.com/package/@rtorcato/api-security-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-security-express.svg)](https://www.npmjs.com/package/@rtorcato/api-security-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-security-express)](https://bundlephobia.com/package/@rtorcato/api-security-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express security-headers middleware — a thin [helmet](https://helmetjs.github.io/)
wrapper with API-friendly defaults.

Hono ships [`secureHeaders`](https://hono.dev/docs/middleware/builtin/secure-headers)
built in, so this adapter is Express-only.

## Install

```sh
pnpm add @rtorcato/api-security-express
```

## Usage

```ts
import { securityMiddleware } from '@rtorcato/api-security-express'

// Sane defaults for a JSON API.
app.use(securityMiddleware())

// Serving HTML too? Turn on helmet's default CSP.
app.use(securityMiddleware({ contentSecurityPolicy: true }))

// Plain-HTTP local dev? Drop HSTS.
app.use(securityMiddleware({ hsts: false }))
```

## Defaults

- Sets helmet's full header suite — `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `X-DNS-Prefetch-Control`,
  and more.
- **CSP off** — helmet's default Content-Security-Policy is tuned for HTML apps
  and routinely blocks assets on a JSON API. Enable it with
  `contentSecurityPolicy: true` if you serve HTML.
- **HSTS on** — `Strict-Transport-Security` is set; disable with `hsts: false`
  for plain-HTTP local development.

`express` is a peer dependency (v4 or v5) — you control the version.

## License

MIT

---
title: api-security-express
description: Express security-headers middleware — a thin helmet wrapper applying its sane defaults.
---

`@rtorcato/api-security-express` is a thin wrapper over
[helmet](https://helmetjs.github.io/) that applies its full, sane default header
suite under the `@rtorcato/api-*` naming. Hono ships
[`secureHeaders`](https://hono.dev/docs/middleware/builtin/secure-headers) built
in, so this adapter is Express-only.

## Install

```bash
pnpm add @rtorcato/api-security-express express
```

`express` is a peer dependency (`^4.18 || ^5`) — you bring your own version.

## Basic usage

```ts
import express from 'express'
import { securityMiddleware } from '@rtorcato/api-security-express'

const app = express()

app.use(securityMiddleware())
```

Register it before your routes so it applies everywhere. Called with no
arguments, it uses helmet's secure defaults.

## What it sets

helmet's full header suite — `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `X-DNS-Prefetch-Control`,
`Strict-Transport-Security`, a default `Content-Security-Policy`, and more.

## Customizing

Any [helmet option](https://helmetjs.github.io/) is forwarded verbatim:

```ts
// Serve HTML with a custom Content-Security-Policy.
app.use(securityMiddleware({
  contentSecurityPolicy: {
    directives: { 'script-src': ["'self'"] },
  },
}))
```

:::tip
For a pure JSON API the defaults are what you want — call `securityMiddleware()`
with no arguments. Reach for options only when the same service renders HTML.
:::

---
title: api-security-express
description: Express security-headers middleware — a thin helmet wrapper with API-friendly defaults.
---

`@rtorcato/api-security-express` wraps [helmet](https://helmetjs.github.io/) with
defaults tuned for JSON APIs. Hono ships
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

Register it before your routes so it applies everywhere.

## Options

```ts
securityMiddleware({
  /**
   * Enable helmet's Content-Security-Policy. helmet's default CSP is tuned for
   * HTML apps and routinely blocks assets on a JSON API. Default: false.
   */
  contentSecurityPolicy: false,

  /**
   * Enable HTTP Strict-Transport-Security. Turn off for plain-HTTP local dev.
   * Default: true.
   */
  hsts: true,
})
```

## What it sets

helmet's full header suite — `X-Content-Type-Options: nosniff`,
`X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `X-DNS-Prefetch-Control`,
`Strict-Transport-Security`, and more.

- **CSP is off by default** — enable it with `contentSecurityPolicy: true` if
  this service also serves HTML.
- **HSTS is on by default** — disable with `hsts: false` for plain-HTTP local
  development.

:::tip
For a pure JSON API the defaults are what you want. Only reach for the CSP toggle
when the same service renders HTML pages.
:::

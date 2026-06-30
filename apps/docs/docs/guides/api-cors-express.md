---
title: api-cors-express
description: Opinionated CORS middleware for Express with sane defaults.
---

`@rtorcato/api-cors-express` wraps the `cors` package with stricter defaults and a
friendlier API. The main difference: a bare string origin is treated as a list
(proper per-request matching) rather than a static header, which avoids leaking
the `Access-Control-Allow-Origin` value on mismatched origins.

## Install

```bash
pnpm add @rtorcato/api-cors-express express
```

`express` is a peer dependency (`^4.18 || ^5`).

## Basic usage

```ts
import express from 'express'
import { corsMiddleware } from '@rtorcato/api-cors-express'

const app = express()

app.use(corsMiddleware({ origin: 'https://app.example.com' }))
```

Register it before your routes so it applies everywhere.

## Options

```ts
corsMiddleware({
  /** Required. Allowed origins — string, array, regexp, or predicate. */
  origin: 'https://app.example.com',

  /** Include credentials (cookies, auth headers). Default: true */
  credentials: true,

  /** Allowed methods. Default: GET POST PUT PATCH DELETE OPTIONS */
  methods: ['GET', 'POST'],

  /** Allowed request headers. Default: Content-Type, Authorization */
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],

  /** Preflight cache duration in seconds. Default: 600 */
  maxAge: 3600,
})
```

## Multiple origins

```ts
app.use(corsMiddleware({
  origin: ['https://app.example.com', 'https://admin.example.com'],
}))
```

## Dynamic origin (predicate)

```ts
const ALLOWED = new Set(['https://app.example.com', 'https://staging.example.com'])

app.use(corsMiddleware({
  origin: (incoming) => ALLOWED.has(incoming ?? ''),
}))
```

Return `true` to allow the origin, `false` to block it.

## Development: allow all

```ts
app.use(corsMiddleware({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://app.example.com'
    : '*',
}))
```

:::warning
`origin: '*'` with `credentials: true` is rejected by browsers. If you need
cookies or `Authorization` headers in development, use the exact origin instead
of a wildcard.
:::

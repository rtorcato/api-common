<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner-mobile.png">
  <img src="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner.png" alt="api-common banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# @rtorcato/api-cors-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-cors-express.svg)](https://www.npmjs.com/package/@rtorcato/api-cors-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-cors-express.svg)](https://www.npmjs.com/package/@rtorcato/api-cors-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-cors-express)](https://bundlephobia.com/package/@rtorcato/api-cors-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express CORS middleware with sane defaults: credentials enabled, standard REST methods, preflight handled at 204.

Hono ships [`cors`](https://hono.dev/docs/middleware/builtin/cors) built in, so this adapter is Express-only.

## Install

```sh
pnpm add @rtorcato/api-cors-express
```

## Usage

```ts
import { corsMiddleware } from '@rtorcato/api-cors-express'

// Single origin
app.use(corsMiddleware({ origin: 'https://myapp.com' }))

// Multiple origins
app.use(corsMiddleware({ origin: ['https://myapp.com', 'https://staging.myapp.com'] }))

// Predicate (e.g. any subdomain)
app.use(corsMiddleware({ origin: (o) => o?.endsWith('.myapp.com') ?? false }))
```

**Defaults:** `credentials: true`, methods: GET POST PUT PATCH DELETE OPTIONS, headers: Content-Type Authorization, preflight `maxAge: 600`.

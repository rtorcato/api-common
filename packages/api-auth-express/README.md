<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner-mobile.png">
  <img src="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner.png" alt="api-common banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# @rtorcato/api-auth-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-auth-express.svg)](https://www.npmjs.com/package/@rtorcato/api-auth-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-auth-express.svg)](https://www.npmjs.com/package/@rtorcato/api-auth-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-auth-express)](https://bundlephobia.com/package/@rtorcato/api-auth-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="40">](https://buymeacoffee.com/rtorcato)

Express middleware for JWT authentication, built on `@rtorcato/api-auth`.

## Install

```sh
pnpm add @rtorcato/api-auth-express @rtorcato/api-auth jsonwebtoken
```

## Usage

```ts
import { authMiddleware, optionalAuthMiddleware } from '@rtorcato/api-auth-express'

// Require a valid JWT — responds 401 if missing or invalid
app.use(authMiddleware(process.env.JWT_SECRET))

// Set req.user if token present and valid, always continues
app.use(optionalAuthMiddleware(process.env.JWT_SECRET))
```

Token is read from `Authorization: Bearer <token>` header, falling back to a `token` cookie. Use `{ cookieName }` to override the cookie name.

Pairs with `@rtorcato/api-errors-express` `errorHandler` to format the `UnauthorizedError` responses.

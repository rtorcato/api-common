<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner-mobile.png">
  <img src="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner.png" alt="api-common banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# @rtorcato/api-auth-hono

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-auth-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-auth-hono)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-auth-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-auth-hono)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-auth-hono)](https://bundlephobia.com/package/@rtorcato/api-auth-hono)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="40">](https://buymeacoffee.com/rtorcato)

Hono middleware for `@rtorcato/api-auth` — JWT authentication with Bearer-header and cookie support.

## Install

```sh
pnpm add @rtorcato/api-auth @rtorcato/api-auth-hono
```

`hono` is a peer dependency — you bring your own version.

## Usage

```ts
import { Hono } from 'hono'
import { authMiddleware, type AuthVariables } from '@rtorcato/api-auth-hono'

const app = new Hono<{ Variables: AuthVariables }>()

app.use(authMiddleware(process.env.JWT_SECRET))

app.get('/me', (c) => c.json({ user: c.get('user') }))
```

Type the app with `{ Variables: AuthVariables }` to get a typed `c.get('user')`.

- `authMiddleware(secret, options?)` — throws `UnauthorizedError` (`missing_token` / `invalid_token`) when the token is absent or invalid. Pair with [`@rtorcato/api-errors-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-hono)'s `errorHandler` to translate it to a JSON response.
- `optionalAuthMiddleware(secret, options?)` — sets `c.get('user')` when a valid token is present, otherwise passes through untouched.

Options: `{ cookieName?: string; verifyOptions?: VerifyOptions }`. The token is read from the `Authorization: Bearer …` header first, then the cookie named `cookieName` (default `token`).

## Related

- [`@rtorcato/api-auth`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth) — framework-agnostic core
- [`@rtorcato/api-auth-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-auth-express) — Express adapter

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-auth-hono

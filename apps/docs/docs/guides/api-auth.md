---
title: api-auth
description: Framework-agnostic JWT utilities — sign, verify, and extract tokens.
---

`@rtorcato/api-auth` provides framework-agnostic helpers for signing and verifying
JWTs, plus extractors that pull a token from an `Authorization` header or cookie.
It wraps `jsonwebtoken` and throws `UnauthorizedError` on invalid tokens so
error-handling middleware downstream handles the 401 automatically.

## Install

```bash
pnpm add @rtorcato/api-auth
```

`jsonwebtoken` is bundled. No peer dependency needed.

## Sign a token

```ts
import { signToken } from '@rtorcato/api-auth'

const token = signToken({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: '15m',
})
```

## Verify a token

```ts
import { verifyToken } from '@rtorcato/api-auth'

const payload = verifyToken(token, process.env.JWT_SECRET)
// payload is jwt.JwtPayload
// throws UnauthorizedError('Invalid or expired token') on failure
```

Pass a generic to type the payload:

```ts
interface Claims { sub: string; role: string }
const claims = verifyToken<Claims>(token, secret)
```

## Extract a token from a request

`findToken` checks `Authorization: Bearer <token>` first, then falls back to a
cookie:

```ts
import { findToken } from '@rtorcato/api-auth'

// in any HTTP handler that exposes headers + cookies
const token = findToken(req, { cookieName: 'access_token' })
// cookieName defaults to 'token' if omitted
```

`findRefreshToken` reads only from cookies:

```ts
import { findRefreshToken } from '@rtorcato/api-auth'

const refresh = findRefreshToken(req, { cookieName: 'refresh_token' })
// cookieName defaults to 'refreshToken' if omitted
```

Both return `undefined` when no token is found — callers decide whether to error.

## Re-exported types

```ts
import type { JwtPayload, SignOptions, VerifyOptions, Secret } from '@rtorcato/api-auth'
```

These are re-exported directly from `jsonwebtoken` so consumers don't need to
install it separately just for the types.

## Related

- [api-auth-express](./api-auth-express.md) — drop-in Express middleware built on top of this

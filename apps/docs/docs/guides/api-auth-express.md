---
title: api-auth-express
description: JWT authentication middleware for Express — authMiddleware and optionalAuthMiddleware.
---

`@rtorcato/api-auth-express` provides two Express middleware functions that verify
a JWT and attach the decoded payload to `req.user`. Failures pass an
`UnauthorizedError` to Express's error handler — pair with
[api-errors-express](./express.md) for automatic JSON 401 responses.

## Install

```bash
pnpm add @rtorcato/api-auth @rtorcato/api-auth-express express
```

`express` is a peer dependency (`^4.18 || ^5`) — you bring your own version.

## authMiddleware

Requires a valid token. Returns `401` if the token is missing or invalid.

```ts
import express from 'express'
import { authMiddleware } from '@rtorcato/api-auth-express'
import { errorHandler } from '@rtorcato/api-errors-express'

const app = express()
const auth = authMiddleware(process.env.JWT_SECRET)

app.get('/me', auth, (req, res) => {
  res.json({ user: req.user })
})

app.use(errorHandler())
```

The token is read from `Authorization: Bearer <token>` first, then from a cookie
named `token`. Customise the cookie name:

```ts
const auth = authMiddleware(process.env.JWT_SECRET, { cookieName: 'access_token' })
```

Pass `verifyOptions` to control JWT verification (algorithm, audience, issuer, etc.):

```ts
const auth = authMiddleware(secret, {
  verifyOptions: { algorithms: ['HS256'], audience: 'my-api' },
})
```

## optionalAuthMiddleware

Tries to verify the token but never blocks the request. If a valid token is
present `req.user` is set; if not (missing, expired, malformed), the request
continues with `req.user` undefined.

```ts
import { optionalAuthMiddleware } from '@rtorcato/api-auth-express'

const optAuth = optionalAuthMiddleware(process.env.JWT_SECRET)

app.get('/feed', optAuth, (req, res) => {
  const feed = req.user ? personalFeed(req.user.sub) : publicFeed()
  res.json(feed)
})
```

## req.user typing

The middleware augments Express's `Request` interface globally:

```ts
// automatically in scope after importing api-auth-express
req.user // jwt.JwtPayload | undefined
```

To extend the type for your own claims:

```ts
declare global {
  namespace Express {
    interface Request {
      user?: { sub: string; role: 'admin' | 'user' }
    }
  }
}
```

## Related

- [api-auth](./api-auth.md) — the underlying sign/verify/extract utilities
- [Express error handling](./express.md) — pairs with `errorHandler` to render 401 as JSON

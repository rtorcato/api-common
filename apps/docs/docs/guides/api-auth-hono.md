---
title: api-auth-hono
description: JWT authentication middleware for Hono — authMiddleware and optionalAuthMiddleware.
---

`@rtorcato/api-auth-hono` provides two Hono middleware functions that verify a JWT
and attach the decoded payload to the request context. Failures throw an
`UnauthorizedError` — pair with [api-errors-hono](./hono.md) for automatic JSON 401
responses. It's the Hono counterpart to [api-auth-express](./api-auth-express.md),
built on the same [api-auth](./api-auth.md) core.

## Install

```bash
pnpm add @rtorcato/api-auth @rtorcato/api-auth-hono hono
```

`hono` is a peer dependency (`^4`) — you bring your own version.

## authMiddleware

Requires a valid token. Throws `UnauthorizedError` (`missing_token` / `invalid_token`)
when the token is absent or invalid.

Type the app with `{ Variables: AuthVariables }` to get a typed `c.get('user')`:

```ts
import { Hono } from 'hono'
import { authMiddleware, type AuthVariables } from '@rtorcato/api-auth-hono'
import { errorHandler } from '@rtorcato/api-errors-hono'

const app = new Hono<{ Variables: AuthVariables }>()

app.use(authMiddleware(process.env.JWT_SECRET))

app.get('/me', (c) => c.json({ user: c.get('user') }))

app.onError(errorHandler())
```

The token is read from `Authorization: Bearer <token>` first, then from a cookie
named `token`. Customise the cookie name:

```ts
app.use(authMiddleware(process.env.JWT_SECRET, { cookieName: 'access_token' }))
```

Pass `verifyOptions` to control JWT verification (algorithm, audience, issuer, etc.):

```ts
app.use(authMiddleware(secret, {
  verifyOptions: { algorithms: ['HS256'], audience: 'my-api' },
}))
```

## optionalAuthMiddleware

Tries to verify the token but never blocks the request. If a valid token is present
`c.get('user')` is set; if not (missing, expired, malformed), the request continues
with `user` undefined.

```ts
import { optionalAuthMiddleware } from '@rtorcato/api-auth-hono'

app.use(optionalAuthMiddleware(process.env.JWT_SECRET))

app.get('/feed', (c) => {
  const user = c.get('user')
  return c.json(user ? personalFeed(user.sub) : publicFeed())
})
```

## Related

- [api-auth](./api-auth.md) — the underlying sign/verify/extract utilities
- [api-auth-express](./api-auth-express.md) — the Express adapter
- [Hono error handling](./hono.md) — pairs with `errorHandler` to render 401 as JSON

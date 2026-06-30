---
title: Adding authentication
description: How to add better-auth to an Express or Hono api-common app.
---

This guide shows how to wire [better-auth](https://www.better-auth.com) into either the Express or Hono example apps. The pattern works identically in your own project.

## Install

```bash
pnpm add better-auth
```

better-auth needs a database adapter. See the [better-auth docs](https://www.better-auth.com/docs/installation) for the full list. The snippets below omit the adapter config for brevity.

---

## Express

```ts title="src/auth.ts"
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  // database: ...,
  emailAndPassword: { enabled: true },
})
```

```ts title="src/index.ts (additions)"
import { toNodeHandler } from 'better-auth/node'
import { auth } from './auth.js'

// Mount the auth routes before your app routes
app.all('/api/auth/*', toNodeHandler(auth))
```

```ts title="src/middleware/requireAuth.ts"
import type { RequestHandler } from 'express'
import { auth } from '../auth.js'

export const requireAuth: RequestHandler = async (req, res, next) => {
  const session = await auth.api.getSession({ headers: req.headers as Headers })
  if (!session) return void res.status(401).json({ success: false, error: 'Unauthorized' })
  // ponytail: attach to locals so downstream handlers stay typed
  res.locals.user = session.user
  next()
}
```

Apply it to any route you want to protect:

```ts
import { requireAuth } from './middleware/requireAuth.js'

app.use('/items', requireAuth, itemsRouter)
```

---

## Hono

```ts title="src/auth.ts"
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  // database: ...,
  emailAndPassword: { enabled: true },
})
```

```ts title="src/index.ts (additions)"
import { auth } from './auth.js'

// Mount the auth routes before your app routes
app.on(['GET', 'POST'], '/api/auth/*splat', (c) => auth.handler(c.req.raw))
```

```ts title="src/middleware/requireAuth.ts"
import type { MiddlewareHandler } from 'hono'
import { auth } from '../auth.js'

export const requireAuth: MiddlewareHandler = async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers })
  if (!session) return c.json({ success: false, error: 'Unauthorized' }, 401)
  c.set('user', session.user)
  await next()
}
```

Apply it per-route or as a group middleware:

```ts
import { requireAuth } from './middleware/requireAuth.js'

app.use('/items/*', requireAuth)
```

---

## Auth endpoints

Once mounted, better-auth exposes standard endpoints under `/api/auth`:

```bash
# Sign up
curl -X POST http://localhost:3001/api/auth/sign-up/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"secret","name":"You"}'

# Sign in
curl -X POST http://localhost:3001/api/auth/sign-in/email \
  -H 'Content-Type: application/json' \
  -d '{"email":"you@example.com","password":"secret"}'
```

The sign-in response includes a `set-cookie` header. Pass that cookie on subsequent requests to access protected routes.

## Further reading

- [better-auth installation](https://www.better-auth.com/docs/installation)
- [better-auth adapters](https://www.better-auth.com/docs/adapters)
- [better-auth plugins](https://www.better-auth.com/docs/plugins) (OAuth, magic link, 2FA, etc.)

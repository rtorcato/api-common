---
title: api-express-utils
description: Small Express utilities — client IP extraction and route listing.
---

`@rtorcato/api-express-utils` provides two lightweight helpers: `getIP` for
extracting the client IP from an Express request, and `logRoutes` for printing
the routes registered on an app.

## Install

```bash
pnpm add @rtorcato/api-express-utils express
```

`express` is a peer dependency (`^4.18 || ^5`).

## getIP

Extracts the client IP. Resolution order: `X-Forwarded-For` (leftmost entry) →
`req.ip` → `socket.remoteAddress`.

```ts
import { getIP } from '@rtorcato/api-express-utils'

app.use((req, _res, next) => {
  console.log('client IP:', getIP(req))
  next()
})
```

:::warning Trust proxy
`X-Forwarded-For` is client-supplied and easily spoofed unless a trusted proxy
overwrites it. Use `getIP` for **logging and analytics only**. For rate-limiting
or authorization keys, configure Express's built-in proxy trust instead:

```ts
app.set('trust proxy', 1) // then use req.ip directly
```
:::

## logRoutes

Walks an Express app's router stack and returns its registered routes. Also
prints them to the console by default — useful at startup.

```ts
import { logRoutes } from '@rtorcato/api-express-utils'

const app = express()
app.get('/users', ...)
app.post('/users', ...)

const routes = logRoutes(app)
// prints: GET /users
//         POST /users
// returns: [{ method: 'GET', path: '/users' }, ...]
```

### Options

```ts
// suppress console output
logRoutes(app, { log: false })

// custom logger (e.g. your structured logger)
logRoutes(app, { log: (line) => logger.info(line) })
```

### RouteInfo type

```ts
import type { RouteInfo } from '@rtorcato/api-express-utils'
// { method: string; path: string }
```

:::note
`logRoutes` resolves top-level routes and one level of mounted routers. Deeply
nested sub-routers show paths relative to their mount point, not the full path.
:::

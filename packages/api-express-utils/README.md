# @rtorcato/api-express-utils

Small Express utility helpers.

```bash
pnpm add @rtorcato/api-express-utils express
```

## `getIP(req)`

Extract the client IP, `X-Forwarded-For`-aware.

```ts
import { getIP } from '@rtorcato/api-express-utils'

app.use((req, res, next) => {
	console.log('client ip:', getIP(req))
	next()
})
```

Order: `X-Forwarded-For` (leftmost) → `req.ip` → `socket.remoteAddress`.

> **Security:** `X-Forwarded-For` is client-supplied and spoofable unless a proxy
> you control overwrites it. Behind a trusted proxy, prefer
> `app.set('trust proxy', …)` and read `req.ip`. Use this helper's header parsing
> for logging/analytics, not for authorization or rate-limit keys on untrusted
> ingress.

## `logRoutes(app, opts?)`

Return (and by default print) the app's registered routes. Useful at boot.

```ts
import { logRoutes } from '@rtorcato/api-express-utils'

logRoutes(app) // prints "GET /health", "POST /users", …

const routes = logRoutes(app, { log: false }) // [{ method, path }, …]
logRoutes(app, { log: (line) => logger.info(line) }) // custom sink
```

Works on Express 4 and 5. Mounted-router paths are relative to their mount point.

# @rtorcato/api-cors-express

Express CORS middleware with sane defaults: credentials enabled, standard REST methods, preflight handled at 204.

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

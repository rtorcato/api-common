# @rtorcato/api-timeout-hono

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-timeout-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout-hono)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-timeout-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout-hono)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hono middleware for [`@rtorcato/api-timeout`](https://www.npmjs.com/package/@rtorcato/api-timeout).
Fails a request with `503` if downstream handlers don't finish within a deadline.

```ts
import { Hono } from 'hono'
import { timeoutMiddleware } from '@rtorcato/api-timeout-hono'

const app = new Hono()

// Any request not answered within 5s gets a 503 error envelope.
app.use(timeoutMiddleware({ ms: 5000 }))
```

On timeout the client receives the standard error envelope from
`@rtorcato/api-errors`:

```json
{ "error": "ServiceUnavailableError", "code": "service_unavailable", "message": "Request timed out" }
```

Non-timeout errors bubble up to Hono's `onError` unchanged.

`hono` is a peer dependency (v4) — you control the version.

## License

MIT

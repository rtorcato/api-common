# @rtorcato/api-timeout-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-timeout-express.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-timeout-express.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express middleware for [`@rtorcato/api-timeout`](https://www.npmjs.com/package/@rtorcato/api-timeout).
Fails a request with `503` if the response isn't sent within a deadline.

```ts
import express from 'express'
import { timeoutMiddleware } from '@rtorcato/api-timeout-express'

const app = express()

// Any request not answered within 5s gets a 503 error envelope.
app.use(timeoutMiddleware({ ms: 5000 }))
```

On timeout the client receives the standard error envelope from
`@rtorcato/api-errors`:

```json
{ "error": "ServiceUnavailableError", "code": "service_unavailable", "message": "Request timed out" }
```

> The middleware sends the 503 and stops. A slow handler that later tries to
> write will hit Express's "headers already sent" — guard late writes with
> `res.headersSent` in long-running handlers.

`express` is a peer dependency (v4 or v5) — you control the version.

## License

MIT

# @rtorcato/api-http

Typed HTTP client over native `fetch` — base URL, default headers, timeout, optional retry, and errors normalized to [`@rtorcato/api-errors`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors).

No `axios`, no wrapper dependency — built on Node's global `fetch` and `AbortSignal.timeout` (Node 22+).

## Install

```sh
pnpm add @rtorcato/api-http @rtorcato/api-errors
```

## Usage

```ts
import { createHttpClient } from '@rtorcato/api-http'

const api = createHttpClient({
  baseURL: 'https://api.example.com',
  headers: { authorization: `Bearer ${token}` },
  timeoutMs: 10_000,
})

const user = await api.get<{ id: string; name: string }>('/users/me')
await api.post('/users', { name: 'Ada' })
await api.get('/items', { query: { page: 2, q: 'hi' } })
```

- `get` / `delete` — `(path, options?)`
- `post` / `put` / `patch` — `(path, body?, options?)` — `body` is JSON-encoded with a `content-type: application/json` header.

## Errors

Non-2xx responses throw an `HttpError` (from `@rtorcato/api-errors`) carrying the status and a message pulled from the response body (`{ message }` / `{ error }` / raw text), so it slots straight into the `api-errors-express` / `api-errors-hono` error handlers. Network failures throw `HttpError` with status `0` and code `network_error`.

```ts
import { HttpError } from '@rtorcato/api-errors'

try {
  await api.get('/missing')
} catch (err) {
  if (err instanceof HttpError && err.status === 404) { /* … */ }
}
```

## Options

| Option | Default | |
| --- | --- | --- |
| `baseURL` | — | prepended to every request path |
| `headers` | — | sent on every request (per-request headers merge on top) |
| `timeoutMs` | `30_000` | per-request timeout (override per call) |
| `retries` | `0` | retry attempts on network error or 5xx |
| `retryDelayMs` | `200` | fixed delay between retries |

Per-request options: `{ headers, query, timeoutMs, signal }`. A caller `signal` is combined with the timeout signal.

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-http

---
title: api-http
description: Typed HTTP client over native fetch, with errors normalized to api-errors.
---

`@rtorcato/api-http` is a small typed HTTP client built on Node's global `fetch`
(Node 22+) — no `axios`, no wrapper dependency. It adds a configured client (base
URL, default headers, timeout, optional retry) and normalizes failures into
[api-errors](./api-errors.md) `HttpError`s so they slot straight into the error
handlers.

## Install

```bash
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

`get` / `delete` take `(path, options?)`; `post` / `put` / `patch` take
`(path, body?, options?)` — the body is JSON-encoded automatically.

## Errors

Non-2xx responses throw an `HttpError` carrying the status and a message pulled
from the response body (`{ message }` / `{ error }` / raw text). Network failures
throw `HttpError` with status `0` and code `network_error`.

```ts
import { HttpError } from '@rtorcato/api-errors'

try {
  await api.get('/missing')
} catch (err) {
  if (err instanceof HttpError && err.status === 404) { /* handle */ }
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

Per-request options: `{ headers, query, timeoutMs, signal }` — a caller `signal`
is combined with the timeout signal.

## Related

- [api-errors](./api-errors.md) — the `HttpError` classes failures are normalized to

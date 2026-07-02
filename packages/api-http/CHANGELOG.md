# @rtorcato/api-http

## 0.2.0

### Minor Changes

- d06c9cd: Add `@rtorcato/api-http` — a typed HTTP client over native `fetch` (Node 22+, no axios). `createHttpClient({ baseURL, headers, timeoutMs, retries })` returns typed `get`/`post`/`put`/`patch`/`delete`; non-2xx and network failures are normalized to `@rtorcato/api-errors` `HttpError`s.

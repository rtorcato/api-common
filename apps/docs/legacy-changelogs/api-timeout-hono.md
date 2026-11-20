# @rtorcato/api-timeout-hono

## 0.1.0

### Minor Changes

- b6ff9d0: Add per-request timeout packages (closes #66):

  - `@rtorcato/api-timeout` — framework-agnostic `withTimeout(promise, ms)` that races a promise against a deadline and rejects with a `ServiceUnavailableError` (503) from `@rtorcato/api-errors`.
  - `@rtorcato/api-timeout-express` — Express middleware; sends the standard 503 error envelope if the response isn't produced within the deadline.
  - `@rtorcato/api-timeout-hono` — Hono middleware; same behaviour, with non-timeout errors bubbling to `onError`.

### Patch Changes

- Updated dependencies [b6ff9d0]
  - @rtorcato/api-timeout@0.1.0

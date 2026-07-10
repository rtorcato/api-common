---
"@rtorcato/api-timeout": minor
"@rtorcato/api-timeout-express": minor
"@rtorcato/api-timeout-hono": minor
---

Add per-request timeout packages (closes #66):

- `@rtorcato/api-timeout` — framework-agnostic `withTimeout(promise, ms)` that races a promise against a deadline and rejects with a `ServiceUnavailableError` (503) from `@rtorcato/api-errors`.
- `@rtorcato/api-timeout-express` — Express middleware; sends the standard 503 error envelope if the response isn't produced within the deadline.
- `@rtorcato/api-timeout-hono` — Hono middleware; same behaviour, with non-timeout errors bubbling to `onError`.

---
"@rtorcato/api-errors": minor
"@rtorcato/api-rate-limit-express": minor
"@rtorcato/api-rate-limit-hono": minor
"@rtorcato/api-errors-express": patch
"@rtorcato/api-errors-hono": patch
"@rtorcato/api-response": patch
---

Unify the error response envelope across packages.

- `api-errors` now exports `toErrorResponse(err, { includeStack })` and the `ErrorResponse` type — the single source of truth for the `{ error, code, message, stack? }` body. The Express and Hono error handlers, and `api-response`, now derive from it instead of hand-rolling the shape.
- **Fix:** the rate-limit middleware (Express + Hono) previously responded `429` with a non-standard body `{ success: false, code: 'rate_limited', message }`. It now returns the standard error envelope `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }`, so clients parse rate-limit errors like any other error. The `code` is now `too_many_requests` (was `rate_limited`).

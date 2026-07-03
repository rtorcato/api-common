# @rtorcato/api-errors-hono

## 0.1.3

### Patch Changes

- 097cc1f: Unify the error response envelope across packages.

  - `api-errors` now exports `toErrorResponse(err, { includeStack })` and the `ErrorResponse` type — the single source of truth for the `{ error, code, message, stack? }` body. The Express and Hono error handlers, and `api-response`, now derive from it instead of hand-rolling the shape.
  - **Fix:** the rate-limit middleware (Express + Hono) previously responded `429` with a non-standard body `{ success: false, code: 'rate_limited', message }`. It now returns the standard error envelope `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }`, so clients parse rate-limit errors like any other error. The `code` is now `too_many_requests` (was `rate_limited`).

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.1.2

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.
- Updated dependencies [fa3f320]
- Updated dependencies [fa3f320]
  - @rtorcato/api-errors@0.2.0

## 0.1.1

### Patch Changes

- 8c3e3e5: Expand README with install + usage examples. No code changes.
- Updated dependencies [8c3e3e5]
  - @rtorcato/api-errors@0.1.1

## 0.1.0

### Minor Changes

- a5c26a7: Initial release.

  - `@rtorcato/api-errors`: framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `InternalServerError`. Each carries `status`, `code`, and `message`.
  - `@rtorcato/api-errors-express`: Express middleware (`errorHandler`, `notFoundHandler`) that maps `HttpError` instances to a `{ error, code, message, stack? }` JSON body. `express` is a peer dependency (`^4 || ^5`).
  - `@rtorcato/api-errors-hono`: Hono middleware (`errorHandler`, `notFoundHandler`) wiring into `app.onError` / `app.notFound` with the same response shape as the Express adapter. `hono` is a peer dependency (`^4`).

### Patch Changes

- Updated dependencies [a5c26a7]
  - @rtorcato/api-errors@0.1.0

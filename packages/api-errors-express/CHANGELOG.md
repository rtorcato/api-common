# @rtorcato/api-errors-express

## 0.2.0

### Minor Changes

- 9fd03c8: Add `asyncHandler()` — wraps an async Express route handler and forwards rejections to `next()`, so `errorHandler` handles them without per-route try/catch.

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

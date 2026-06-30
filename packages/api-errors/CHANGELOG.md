# @rtorcato/api-errors

## 0.2.0

### Minor Changes

- fa3f320: Add `UnprocessableEntityError` (422), `TooManyRequestsError` (429), and `ServiceUnavailableError` (503) classes.

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

## 0.1.1

### Patch Changes

- 8c3e3e5: Expand README with install + usage examples. No code changes.

## 0.1.0

### Minor Changes

- a5c26a7: Initial release.

  - `@rtorcato/api-errors`: framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `InternalServerError`. Each carries `status`, `code`, and `message`.
  - `@rtorcato/api-errors-express`: Express middleware (`errorHandler`, `notFoundHandler`) that maps `HttpError` instances to a `{ error, code, message, stack? }` JSON body. `express` is a peer dependency (`^4 || ^5`).
  - `@rtorcato/api-errors-hono`: Hono middleware (`errorHandler`, `notFoundHandler`) wiring into `app.onError` / `app.notFound` with the same response shape as the Express adapter. `hono` is a peer dependency (`^4`).

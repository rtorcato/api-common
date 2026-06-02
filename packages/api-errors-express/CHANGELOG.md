# @rtorcato/api-errors-express

## 0.1.0

### Minor Changes

- a5c26a7: Initial release.

  - `@rtorcato/api-errors`: framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `InternalServerError`. Each carries `status`, `code`, and `message`.
  - `@rtorcato/api-errors-express`: Express middleware (`errorHandler`, `notFoundHandler`) that maps `HttpError` instances to a `{ error, code, message, stack? }` JSON body. `express` is a peer dependency (`^4 || ^5`).
  - `@rtorcato/api-errors-hono`: Hono middleware (`errorHandler`, `notFoundHandler`) wiring into `app.onError` / `app.notFound` with the same response shape as the Express adapter. `hono` is a peer dependency (`^4`).

### Patch Changes

- Updated dependencies [a5c26a7]
  - @rtorcato/api-errors@0.1.0

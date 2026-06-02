---
"@rtorcato/api-errors": minor
"@rtorcato/api-errors-express": minor
"@rtorcato/api-errors-hono": minor
---

Initial release.

- `@rtorcato/api-errors`: framework-agnostic `HttpError` base class plus `BadRequestError`, `UnauthorizedError`, `ForbiddenError`, `NotFoundError`, `ConflictError`, `InternalServerError`. Each carries `status`, `code`, and `message`.
- `@rtorcato/api-errors-express`: Express middleware (`errorHandler`, `notFoundHandler`) that maps `HttpError` instances to a `{ error, code, message, stack? }` JSON body. `express` is a peer dependency (`^4 || ^5`).
- `@rtorcato/api-errors-hono`: Hono middleware (`errorHandler`, `notFoundHandler`) wiring into `app.onError` / `app.notFound` with the same response shape as the Express adapter. `hono` is a peer dependency (`^4`).

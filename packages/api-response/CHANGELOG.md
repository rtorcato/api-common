# @rtorcato/api-response

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-errors@1.0.0

## 0.1.1

### Patch Changes

- 097cc1f: Unify the error response envelope across packages.

  - `api-errors` now exports `toErrorResponse(err, { includeStack })` and the `ErrorResponse` type — the single source of truth for the `{ error, code, message, stack? }` body. The Express and Hono error handlers, and `api-response`, now derive from it instead of hand-rolling the shape.
  - **Fix:** the rate-limit middleware (Express + Hono) previously responded `429` with a non-standard body `{ success: false, code: 'rate_limited', message }`. It now returns the standard error envelope `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }`, so clients parse rate-limit errors like any other error. The `code` is now `too_many_requests` (was `rate_limited`).

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.1.0

### Minor Changes

- 7495730: Update the `zod` peer dependency range from `^3.23.0` to `^4.0.0`. These packages are developed and tested against Zod 4 (which is what the workspace resolves); the old `^3.23.0` peer no longer matched reality. Consumers still on Zod 3 should upgrade to Zod 4.

## 0.0.1

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

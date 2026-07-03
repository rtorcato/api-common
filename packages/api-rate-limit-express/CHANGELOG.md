# @rtorcato/api-rate-limit-express

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-errors@1.0.0
  - @rtorcato/api-express-utils@1.0.0
  - @rtorcato/api-rate-limit@1.0.0

## 0.2.0

### Minor Changes

- 097cc1f: Unify the error response envelope across packages.

  - `api-errors` now exports `toErrorResponse(err, { includeStack })` and the `ErrorResponse` type — the single source of truth for the `{ error, code, message, stack? }` body. The Express and Hono error handlers, and `api-response`, now derive from it instead of hand-rolling the shape.
  - **Fix:** the rate-limit middleware (Express + Hono) previously responded `429` with a non-standard body `{ success: false, code: 'rate_limited', message }`. It now returns the standard error envelope `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }`, so clients parse rate-limit errors like any other error. The `code` is now `too_many_requests` (was `rate_limited`).

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.1.0

### Minor Changes

- 1669391: First `0.1.0` release. These packages were sitting at `0.0.0` despite being
  test-covered, documented, and (for several) already on npm. Floor them at
  `0.1.0` so the version reflects real maturity. No API changes.

### Patch Changes

- Updated dependencies [439d346]
  - @rtorcato/api-express-utils@0.3.0

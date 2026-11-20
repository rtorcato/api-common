# @rtorcato/api-express-utils

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

## 0.3.0

### Minor Changes

- 439d346: New package: Express utility helpers.

  - `getIP(req)` — `X-Forwarded-For`-aware client IP extraction.
  - `logRoutes(app, opts?)` — return/print an app's registered routes at boot.

## 0.2.0

### Minor Changes

- 9c52aa4: New package: Express utility helpers.

  - `getIP(req)` — `X-Forwarded-For`-aware client IP extraction.
  - `logRoutes(app, opts?)` — return/print an app's registered routes at boot.

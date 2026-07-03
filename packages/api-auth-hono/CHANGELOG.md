# @rtorcato/api-auth-hono

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-auth@1.0.0
  - @rtorcato/api-errors@1.0.0

## 0.2.1

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0
  - @rtorcato/api-auth@0.1.1

## 0.2.0

### Minor Changes

- ae1ca0d: Add `@rtorcato/api-auth-hono` — Hono middleware over `@rtorcato/api-auth`. Provides `authMiddleware` and `optionalAuthMiddleware` with Bearer-header and cookie token support, and an `AuthVariables` type for a typed `c.get('user')`.

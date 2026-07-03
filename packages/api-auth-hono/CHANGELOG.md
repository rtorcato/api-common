# @rtorcato/api-auth-hono

## 0.2.1

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0
  - @rtorcato/api-auth@0.1.1

## 0.2.0

### Minor Changes

- ae1ca0d: Add `@rtorcato/api-auth-hono` — Hono middleware over `@rtorcato/api-auth`. Provides `authMiddleware` and `optionalAuthMiddleware` with Bearer-header and cookie token support, and an `AuthVariables` type for a typed `c.get('user')`.

# @rtorcato/api-http

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-errors@1.0.0

## 0.2.1

### Patch Changes

- Updated dependencies [097cc1f]
  - @rtorcato/api-errors@0.3.0

## 0.2.0

### Minor Changes

- d06c9cd: Add `@rtorcato/api-http` — a typed HTTP client over native `fetch` (Node 22+, no axios). `createHttpClient({ baseURL, headers, timeoutMs, retries })` returns typed `get`/`post`/`put`/`patch`/`delete`; non-2xx and network failures are normalized to `@rtorcato/api-errors` `HttpError`s.

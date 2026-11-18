# @rtorcato/api-config

## 2.0.0

### Major Changes

- 2f10ea2: Require Node.js `>=24` and bump `@rtorcato/js-common` to `^6.2.1`. js-common 6 itself requires Node 24, so these four packages raise their `engines.node` floor from `>=22` to `>=24`. Consumers on Node 22 must upgrade Node before taking this release. No API changes.

## 1.0.1

### Patch Changes

- 238375a: Bump `@rtorcato/js-common` to `^5.0.0`. js-common 5 makes `zod` an optional peer, but its `./env` entry (used here for `isDev`/`isProd`/`isTest`) imports it at load time, so `api-errors-express`, `api-errors-hono` and `api-logger` now declare `zod` as a dependency to keep it installed for consumers.

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

## 0.2.0

### Minor Changes

- 7495730: Update the `zod` peer dependency range from `^3.23.0` to `^4.0.0`. These packages are developed and tested against Zod 4 (which is what the workspace resolves); the old `^3.23.0` peer no longer matched reality. Consumers still on Zod 3 should upgrade to Zod 4.

## 0.1.0

### Minor Changes

- be7810d: Add four packages seeded from the api-starter reference app:

  - `@rtorcato/api-logger` — framework-agnostic pino logger factory.
  - `@rtorcato/api-validation` — zod request validation that throws `BadRequestError`, plus `formatZodError`.
  - `@rtorcato/api-config` — `loadEnv(schema)` for dotenv + zod env validation (throws instead of `process.exit`).
  - `@rtorcato/api-rate-limit` — in-memory sliding-window limiter with bounded memory.

### Patch Changes

- fa3f320: Add `repository`, `homepage`, `bugs`, and `keywords` metadata to every package for npm discoverability.

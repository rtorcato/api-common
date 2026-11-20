# @rtorcato/api-openapi-hono

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

## 0.1.0

### Minor Changes

- 88cc0ee: Add `@rtorcato/api-openapi-hono` — a Hono adapter for schema-first OpenAPI docs. `configureOpenAPI(app, { document })` wires `@hono/zod-openapi`'s `doc31()` (OpenAPI 3.1 JSON generated from the route Zod schemas) and mounts the Scalar API reference UI, with configurable paths and Scalar overrides.

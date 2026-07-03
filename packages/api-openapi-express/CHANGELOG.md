# @rtorcato/api-openapi-express

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-openapi@1.0.0

## 0.2.1

### Patch Changes

- Updated dependencies [7a51835]
  - @rtorcato/api-openapi@0.2.1

## 0.2.0

### Minor Changes

- 13fd3ec: Add `mountOpenAPI(app, { doc, ui, specPath, docsPath })` — wires the spec JSON and a docs UI (Scalar or Swagger) directly onto an Express app or router, with the UI fetching the spec by URL. Also add `specFromJsDoc({ definition, apis })`, which builds a spec from JSDoc-annotated files via `swagger-jsdoc` (a new **optional** peer dependency) for legacy projects. Existing `serveApiDocs` / `serveSwaggerDocs` are unchanged.

## 0.1.1

### Patch Changes

- Updated dependencies [8701d23]
  - @rtorcato/api-openapi@0.2.0

## 0.1.0

### Minor Changes

- 1669391: First `0.1.0` release. These packages were sitting at `0.0.0` despite being
  test-covered, documented, and (for several) already on npm. Floor them at
  `0.1.0` so the version reflects real maturity. No API changes.

### Patch Changes

- Updated dependencies [1669391]
  - @rtorcato/api-openapi@0.1.0

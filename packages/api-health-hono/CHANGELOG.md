# @rtorcato/api-health-hono

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-health@1.0.0

## 0.1.0

### Minor Changes

- c273623: Add health-check packages: a framework-agnostic readiness registry (`createHealthRegistry`) plus Express and Hono liveness/readiness probe handlers (`livenessHandler`, `readinessHandler`) for `/healthz` and `/readyz` endpoints.

### Patch Changes

- Updated dependencies [c273623]
  - @rtorcato/api-health@0.1.0

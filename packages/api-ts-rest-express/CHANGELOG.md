# @rtorcato/api-ts-rest-express

## 1.1.0

### Minor Changes

- e80cdcc: Add `withDefaultErrors` and `defaultErrorSchema` for attaching the shared `400`/`404`/`500` error envelope (matching `@rtorcato/api-errors-express`) to a ts-rest route's `responses`, plus `RestRequest` / `RestResponse` inference-type aliases for typing handlers off a contract.

## 1.0.0

### Major Changes

- 352ee8e: First stable release — **1.0.0**.

  The public API of every `@rtorcato/api-*` package is now frozen under semver following the 1.0 API-freeze audit (#88). No new code changes in this release: the error-envelope unification and the naming fixes (`uploadFile`, `createShutdownController`) already shipped across the preceding 0.x releases; this bump marks the surface as stable.

### Patch Changes

- Updated dependencies [352ee8e]
  - @rtorcato/api-openapi-express@1.0.0

## 0.2.1

### Patch Changes

- @rtorcato/api-openapi-express@0.2.1

## 0.2.0

### Minor Changes

- bcc5759: Add `@rtorcato/api-ts-rest-express` — `mountTsRest(app, { contract, router, openapi })` registers a ts-rest contract's routes on Express and (optionally) generates an OpenAPI 3.1 doc from the contract and serves it as Scalar docs via `@rtorcato/api-openapi-express`. Requires `@ts-rest/*` ≥ 3.53.0-rc.1 (first release supporting zod 4 + express 5). `@ts-rest/*`, `express`, and `zod` are peer dependencies.

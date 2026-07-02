# @rtorcato/api-ts-rest-express

## 0.2.0

### Minor Changes

- bcc5759: Add `@rtorcato/api-ts-rest-express` — `mountTsRest(app, { contract, router, openapi })` registers a ts-rest contract's routes on Express and (optionally) generates an OpenAPI 3.1 doc from the contract and serves it as Scalar docs via `@rtorcato/api-openapi-express`. Requires `@ts-rest/*` ≥ 3.53.0-rc.1 (first release supporting zod 4 + express 5). `@ts-rest/*`, `express`, and `zod` are peer dependencies.

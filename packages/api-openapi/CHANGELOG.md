# @rtorcato/api-openapi

## 0.2.1

### Patch Changes

- 7a51835: 1.0 surface hygiene (from the #88 API-freeze audit)

  - **api-upload:** rename `uploader()` → `uploadFile()` so the action reads as a verb, consistent with `validate`/`connect`/`createX` across the packages. **Breaking:** update imports (`import { uploadFile } from '@rtorcato/api-upload'`).
  - **api-graceful-shutdown:** rename `createShutdownHandler()` → `createShutdownController()` so the factory matches its return type `ShutdownController` (mirrors `createHealthRegistry → HealthRegistry`). **Breaking:** update imports.
  - **api-openapi:** replace `export * from './builder'` with explicit named re-exports so the public surface is enumerated and can't silently widen/narrow. No symbols added or removed.
  - **api-amqp:** type `connect(url, socketOptions?)`'s second parameter against amqplib (`Parameters<typeof amqp.connect>[1]`) instead of `unknown`.

## 0.2.0

### Minor Changes

- 8701d23: Add a schema-first OpenAPI 3.1 document builder. `buildOpenApiDocument({ info, routes })` assembles a spec from route definitions whose params/query/headers/body/responses are Zod schemas — converted with Zod 4's native `z.toJSONSchema` (no new runtime dep), so the docs derive from the same schemas you validate with and can't drift. Also adds `docsHtml({ specUrl, ui })`, a URL-based Scalar/Swagger renderer that complements the existing spec-inlining generators.

## 0.1.0

### Minor Changes

- 1669391: First `0.1.0` release. These packages were sitting at `0.0.0` despite being
  test-covered, documented, and (for several) already on npm. Floor them at
  `0.1.0` so the version reflects real maturity. No API changes.

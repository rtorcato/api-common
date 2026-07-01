# @rtorcato/api-openapi

## 0.2.0

### Minor Changes

- 8701d23: Add a schema-first OpenAPI 3.1 document builder. `buildOpenApiDocument({ info, routes })` assembles a spec from route definitions whose params/query/headers/body/responses are Zod schemas — converted with Zod 4's native `z.toJSONSchema` (no new runtime dep), so the docs derive from the same schemas you validate with and can't drift. Also adds `docsHtml({ specUrl, ui })`, a URL-based Scalar/Swagger renderer that complements the existing spec-inlining generators.

## 0.1.0

### Minor Changes

- 1669391: First `0.1.0` release. These packages were sitting at `0.0.0` despite being
  test-covered, documented, and (for several) already on npm. Floor them at
  `0.1.0` so the version reflects real maturity. No API changes.

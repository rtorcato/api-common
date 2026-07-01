---
"@rtorcato/api-openapi": minor
---

Add a schema-first OpenAPI 3.1 document builder. `buildOpenApiDocument({ info, routes })` assembles a spec from route definitions whose params/query/headers/body/responses are Zod schemas — converted with Zod 4's native `z.toJSONSchema` (no new runtime dep), so the docs derive from the same schemas you validate with and can't drift. Also adds `docsHtml({ specUrl, ui })`, a URL-based Scalar/Swagger renderer that complements the existing spec-inlining generators.

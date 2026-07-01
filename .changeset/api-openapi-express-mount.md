---
"@rtorcato/api-openapi-express": minor
---

Add `mountOpenAPI(app, { doc, ui, specPath, docsPath })` — wires the spec JSON and a docs UI (Scalar or Swagger) directly onto an Express app or router, with the UI fetching the spec by URL. Also add `specFromJsDoc({ definition, apis })`, which builds a spec from JSDoc-annotated files via `swagger-jsdoc` (a new **optional** peer dependency) for legacy projects. Existing `serveApiDocs` / `serveSwaggerDocs` are unchanged.

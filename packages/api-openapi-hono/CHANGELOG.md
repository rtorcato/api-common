# @rtorcato/api-openapi-hono

## 0.1.0

### Minor Changes

- 88cc0ee: Add `@rtorcato/api-openapi-hono` — a Hono adapter for schema-first OpenAPI docs. `configureOpenAPI(app, { document })` wires `@hono/zod-openapi`'s `doc31()` (OpenAPI 3.1 JSON generated from the route Zod schemas) and mounts the Scalar API reference UI, with configurable paths and Scalar overrides.

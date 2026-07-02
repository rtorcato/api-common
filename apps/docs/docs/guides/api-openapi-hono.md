---
title: api-openapi-hono
description: Schema-first OpenAPI docs for Hono — Scalar UI derived from your route Zod schemas.
---

`@rtorcato/api-openapi-hono` wires [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
and serves the [Scalar](https://github.com/scalar/scalar) API reference UI. The spec
derives from your route Zod schemas, so the docs can't drift from validation. It's the
Hono counterpart to [api-openapi-express](./api-openapi-express.md).

## Install

```bash
pnpm add @rtorcato/api-openapi-hono @hono/zod-openapi @scalar/hono-api-reference hono
```

`hono`, `@hono/zod-openapi`, and `@scalar/hono-api-reference` are peer dependencies —
you bring your own versions.

## Usage

```ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { configureOpenAPI } from '@rtorcato/api-openapi-hono'

const app = new OpenAPIHono()

app.openapi(
  createRoute({
    method: 'get',
    path: '/health',
    responses: {
      200: {
        content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
        description: 'Health check',
      },
    },
  }),
  (c) => c.json({ ok: true }),
)

configureOpenAPI(app, {
  document: { info: { title: 'My API', version: '1.0.0' } },
})
// → GET /doc         OpenAPI 3.1 JSON (generated from the route schemas)
// → GET /reference   Scalar API reference UI
```

## Options

```ts
configureOpenAPI(app, {
  document: {
    info: { title: 'My API', version: '1.0.0', description: 'What it does' },
    servers: [{ url: 'https://api.example.com' }],
    // openapi defaults to '3.1.0'
  },
  docPath: '/openapi.json',        // default: '/doc'
  referencePath: '/docs',          // default: '/reference'
  scalar: { theme: 'purple', layout: 'classic' },
})
```

`scalar` is passed straight to `@scalar/hono-api-reference`, so any of its config
(theme, layout, `pageTitle`, auth, …) is accepted.

## Related

- [api-openapi](./api-openapi.md) — framework-agnostic Scalar/Swagger HTML generators
- [api-openapi-express](./api-openapi-express.md) — the Express adapter

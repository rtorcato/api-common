---
title: api-openapi-express
description: Express middleware for serving Swagger UI and Scalar API Reference from an OpenAPI spec.
---

`@rtorcato/api-common/openapi/express` mounts API documentation UIs as Express routers.
Each function serves the rendered HTML at `/` and the raw spec at `/openapi.json`.

## Install

```bash
pnpm add @rtorcato/api-common express swagger-jsdoc zod
```

`express` is a peer dependency (`^4.18 || ^5`).

## serveApiDocs (Scalar)

Mounts [Scalar](https://scalar.com) API Reference.

```ts
import { serveApiDocs } from '@rtorcato/api-common/openapi/express'
import { spec } from './spec.js'

app.use('/api-docs', serveApiDocs(spec, { title: 'My API', theme: 'deepSpace' }))
// GET /api-docs          → Scalar UI
// GET /api-docs/openapi.json → raw spec
```

## serveSwaggerDocs (Swagger UI)

Mounts Swagger UI.

```ts
import { serveSwaggerDocs } from '@rtorcato/api-common/openapi/express'
import { spec } from './spec.js'

app.use('/swagger', serveSwaggerDocs(spec, { title: 'My API' }))
// GET /swagger          → Swagger UI
// GET /swagger/openapi.json → raw spec
```

## Options

Both functions accept the same options as their counterparts in
[`api-openapi`](./api-openapi.md) — `serveApiDocs` takes `ScalarOptions`,
`serveSwaggerDocs` takes `SwaggerOptions`.

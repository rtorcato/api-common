# @rtorcato/api-openapi-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-openapi-express.svg)](https://www.npmjs.com/package/@rtorcato/api-openapi-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-openapi-express.svg)](https://www.npmjs.com/package/@rtorcato/api-openapi-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-openapi-express)](https://bundlephobia.com/package/@rtorcato/api-openapi-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Serve [Scalar](https://scalar.com) or [Swagger UI](https://swagger.io/tools/swagger-ui/) API docs in Express from an OpenAPI spec — as a self-contained router, or mounted directly onto your app.

## Install

```bash
pnpm add @rtorcato/api-openapi-express express
```

`express` is a peer dependency (`^4.18 || ^5`).

## Mount onto your app

`mountOpenAPI` wires two routes onto an existing app (or router): the raw spec JSON and a docs UI that fetches it.

```ts
import { mountOpenAPI } from '@rtorcato/api-openapi-express'
import { buildOpenApiDocument } from '@rtorcato/api-openapi'

const doc = buildOpenApiDocument({ info: { title: 'My API', version: '1.0.0' }, routes: [...] })

mountOpenAPI(app, { doc, title: 'My API' })
// → GET /openapi.json (spec) and GET /docs (Scalar UI)

mountOpenAPI(app, { doc, ui: 'swagger', specPath: '/spec.json', docsPath: '/api-docs' })
```

Pair it with [`@rtorcato/api-openapi`](../api-openapi)'s `buildOpenApiDocument` to keep the spec schema-first (derived from the same Zod schemas you validate with).

## Self-contained routers

`serveApiDocs` / `serveSwaggerDocs` return a `Router` that also serves the spec at a relative `/openapi.json`:

```ts
import { serveApiDocs, serveSwaggerDocs } from '@rtorcato/api-openapi-express'
import { spec } from './spec.js'

// Scalar UI at /api-docs, raw spec at /api-docs/openapi.json
app.use('/api-docs', serveApiDocs(spec, { title: 'My API', theme: 'deepSpace' }))

// Swagger UI at /swagger, raw spec at /swagger/openapi.json
app.use('/swagger', serveSwaggerDocs(spec, { title: 'My API' }))
```

## Legacy JSDoc ingestion

For older projects that document routes with `@openapi` JSDoc comments, `specFromJsDoc` builds a spec via [`swagger-jsdoc`](https://www.npmjs.com/package/swagger-jsdoc) — an **optional** peer dependency (install it only if you use this):

```bash
pnpm add swagger-jsdoc
```

```ts
import { mountOpenAPI, specFromJsDoc } from '@rtorcato/api-openapi-express'

const doc = await specFromJsDoc({
	definition: { openapi: '3.1.0', info: { title: 'My API', version: '1.0.0' } },
	apis: ['./src/routes/*.ts'],
})
mountOpenAPI(app, { doc })
```

## API

### `serveApiDocs(spec, options?)` → `Router`

Mounts Scalar API Reference. Accepts [`ScalarOptions`](../api-openapi) (`title`, `theme`, `cdnUrl`).

### `serveSwaggerDocs(spec, options?)` → `Router`

Mounts Swagger UI. Accepts [`SwaggerOptions`](../api-openapi) (`title`, `cssCdnUrl`, `jsCdnUrl`).

Both routers expose:
- `GET /` — rendered HTML UI
- `GET /openapi.json` — raw spec as JSON

### `mountOpenAPI(app, { doc, ui?, specPath?, docsPath?, title?, theme?, ... })` → `void`

Mounts `GET specPath` (raw spec) and `GET docsPath` (docs UI) onto an Express app or router. `ui` is `'scalar'` (default) or `'swagger'`; `specPath` defaults to `/openapi.json`, `docsPath` to `/docs`.

### `specFromJsDoc({ definition, apis })` → `Promise<object>`

Builds a spec from JSDoc-annotated files via the optional `swagger-jsdoc` peer. Throws a helpful error if `swagger-jsdoc` isn't installed.

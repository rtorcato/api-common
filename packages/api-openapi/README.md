# @rtorcato/api-openapi

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-openapi.svg)](https://www.npmjs.com/package/@rtorcato/api-openapi)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-openapi.svg)](https://www.npmjs.com/package/@rtorcato/api-openapi)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-openapi)](https://bundlephobia.com/package/@rtorcato/api-openapi)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic OpenAPI 3.1 helpers:

- **`buildOpenApiDocument`** — build an OpenAPI 3.1 document from route definitions whose request/response shapes are **Zod schemas**. Schema-first: the spec derives from the same schemas you validate with, so the docs can't drift.
- **`docsHtml` / `generateScalarHtml` / `generateSwaggerHtml`** — render [Scalar](https://scalar.com) or [Swagger UI](https://swagger.io/tools/swagger-ui/) HTML from a spec.

No runtime dependencies — the builder uses Zod 4's native `z.toJSONSchema`. `zod` is a peer dependency.

## Install

```bash
pnpm add @rtorcato/api-openapi zod
```

## Build a spec from Zod schemas

```ts
import { z } from 'zod'
import { buildOpenApiDocument, docsHtml } from '@rtorcato/api-openapi'

const doc = buildOpenApiDocument({
	info: { title: 'Users API', version: '1.0.0' },
	servers: [{ url: 'https://api.example.com' }],
	routes: [
		{
			method: 'get',
			path: '/users/:id', // Express or OpenAPI style — both work
			summary: 'Get a user',
			request: { params: z.object({ id: z.string() }) },
			responses: {
				200: { description: 'A user', schema: z.object({ id: z.string(), name: z.string() }) },
				404: { description: 'Not found' },
			},
		},
		{
			method: 'post',
			path: '/users',
			request: { body: z.object({ name: z.string().min(1) }) },
			responses: { 201: { description: 'Created', schema: z.object({ id: z.string() }) } },
		},
	],
})
```

`request.params` / `request.query` / `request.headers` take an **object** schema — each property becomes a parameter (path params are always required). `request.body` and each `responses[code].schema` become request/response body schemas. Reuse the exact schemas you pass to [`@rtorcato/api-validation`](../api-validation) so validation and docs stay in lock-step.

## Serve the docs

`docsHtml` loads the spec from a URL — serve the JSON and the HTML from two routes:

```ts
// Express example (any framework works — these are plain values)
app.get('/openapi.json', (_req, res) => res.json(doc))
app.get('/docs', (_req, res) => res.type('html').send(docsHtml({ specUrl: '/openapi.json' })))
```

```ts
docsHtml({
	specUrl: '/openapi.json',
	ui: 'scalar', // or 'swagger' — default 'scalar'
	title: 'Users API',
	theme: 'deepSpace', // Scalar only
})
```

For Express, [`@rtorcato/api-openapi-express`](../api-openapi-express) wires these into a Router; for Hono, [`@rtorcato/api-openapi-hono`](../api-openapi-hono) does the schema-first `@hono/zod-openapi` wiring.

## Inline generators

When you already have a spec object and want to embed it directly (no separate spec URL):

```ts
import { generateScalarHtml, generateSwaggerHtml } from '@rtorcato/api-openapi'

const scalarHtml = generateScalarHtml(doc, { title: 'My API', theme: 'deepSpace' })
const swaggerHtml = generateSwaggerHtml(doc, { title: 'My API' })
```

## API

### `buildOpenApiDocument(config)`

Returns an OpenAPI 3.1 document. `config`: `{ info, routes, servers?, components?, security?, tags? }`. Each route: `{ method, path, summary?, description?, operationId?, tags?, request?, responses }`.

### `docsHtml({ specUrl, ui?, title?, theme?, cdnUrl?, cssCdnUrl?, jsCdnUrl? })`

HTML that fetches the spec from `specUrl`. `ui` is `'scalar'` (default) or `'swagger'`.

### `generateScalarHtml(spec, options?)` / `generateSwaggerHtml(spec, options?)`

Embed a spec object directly. Scalar themes: `default`, `alternate`, `moon`, `purple`, `solarized`, `bluePlanet`, `deepSpace`, `saturn`, `kepler`, `mars`, `none`.

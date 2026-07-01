# @rtorcato/api-openapi-hono

Schema-first OpenAPI docs for Hono. Wires [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) and serves the [Scalar](https://github.com/scalar/scalar) API reference UI — the spec derives from your route Zod schemas, so the docs can't drift from validation.

## Install

```sh
pnpm add @rtorcato/api-openapi-hono @hono/zod-openapi @scalar/hono-api-reference hono
```

`hono`, `@hono/zod-openapi`, and `@scalar/hono-api-reference` are peer dependencies — you bring your own versions.

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
	docPath: '/openapi.json', // default: '/doc'
	referencePath: '/docs', // default: '/reference'
	scalar: { theme: 'purple', layout: 'classic' }, // overrides the kepler/modern defaults
})
```

`scalar` is passed straight to `@scalar/hono-api-reference`, so any of its config (theme, layout, `pageTitle`, auth, …) is accepted.

## Related

- [`@rtorcato/api-openapi`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi) — framework-agnostic Scalar/Swagger HTML generators
- [`@rtorcato/api-openapi-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-express) — Express adapter

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-hono

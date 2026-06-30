# @rtorcato/api-openapi

Framework-agnostic HTML generators for [Scalar](https://scalar.com) and [Swagger UI](https://swagger.io/tools/swagger-ui/) from an OpenAPI spec object.

## Install

```bash
pnpm add @rtorcato/api-openapi
```

## Usage

```ts
import { generateScalarHtml, generateSwaggerHtml } from '@rtorcato/api-openapi'
import { spec } from './spec.js'

// Scalar (recommended)
const scalarHtml = generateScalarHtml(spec, { title: 'My API', theme: 'deepSpace' })

// Swagger UI
const swaggerHtml = generateSwaggerHtml(spec, { title: 'My API' })
```

Serve the returned string as an HTML response from any framework.
For Express, use [`@rtorcato/api-openapi-express`](../api-openapi-express).

## API

### `generateScalarHtml(spec, options?)`

| Option | Default |
|---|---|
| `title` | `'API Reference'` |
| `theme` | — (Scalar default) |
| `cdnUrl` | `https://cdn.jsdelivr.net/npm/@scalar/api-reference` |

Available themes: `default`, `alternate`, `moon`, `purple`, `solarized`, `bluePlanet`, `deepSpace`, `saturn`, `kepler`, `mars`, `none`.

### `generateSwaggerHtml(spec, options?)`

| Option | Default |
|---|---|
| `title` | `'API Reference'` |
| `cssCdnUrl` | `https://unpkg.com/swagger-ui-dist/swagger-ui.css` |
| `jsCdnUrl` | `https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js` |

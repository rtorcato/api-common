---
title: api-openapi
description: Framework-agnostic HTML generators for Swagger UI and Scalar API Reference.
---

`@rtorcato/api-openapi` generates ready-to-serve HTML pages from an OpenAPI spec
object — either Swagger UI or Scalar. It has no framework dependency; use it
directly or via an adapter like `@rtorcato/api-openapi-express`.

## Install

```bash
pnpm add @rtorcato/api-openapi
```

## generateSwaggerHtml

Returns a self-contained Swagger UI HTML string.

```ts
import { generateSwaggerHtml } from '@rtorcato/api-openapi'

const html = generateSwaggerHtml(spec, { title: 'My API' })
```

### Options

| Option | Default |
|---|---|
| `title` | `'API Reference'` |
| `cssCdnUrl` | `https://unpkg.com/swagger-ui-dist/swagger-ui.css` |
| `jsCdnUrl` | `https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js` |

## generateScalarHtml

Returns a self-contained [Scalar](https://scalar.com) API Reference HTML string.

```ts
import { generateScalarHtml } from '@rtorcato/api-openapi'

const html = generateScalarHtml(spec, { title: 'My API', theme: 'deepSpace' })
```

### Options

| Option | Default |
|---|---|
| `title` | `'API Reference'` |
| `theme` | — (uses Scalar default) |
| `cdnUrl` | `https://cdn.jsdelivr.net/npm/@scalar/api-reference` |

Available themes: `default`, `alternate`, `moon`, `purple`, `solarized`,
`bluePlanet`, `deepSpace`, `saturn`, `kepler`, `mars`, `none`.

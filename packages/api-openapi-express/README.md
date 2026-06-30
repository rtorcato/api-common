# @rtorcato/api-openapi-express

Express routers that serve [Scalar](https://scalar.com) or [Swagger UI](https://swagger.io/tools/swagger-ui/) from an OpenAPI spec object. Each router also exposes the raw spec at `/openapi.json`.

## Install

```bash
pnpm add @rtorcato/api-openapi-express express
```

`express` is a peer dependency (`^4.18 || ^5`).

## Usage

```ts
import { serveApiDocs, serveSwaggerDocs } from '@rtorcato/api-openapi-express'
import { spec } from './spec.js'

// Scalar UI at /api-docs, raw spec at /api-docs/openapi.json
app.use('/api-docs', serveApiDocs(spec, { title: 'My API', theme: 'deepSpace' }))

// Swagger UI at /swagger, raw spec at /swagger/openapi.json
app.use('/swagger', serveSwaggerDocs(spec, { title: 'My API' }))
```

## API

### `serveApiDocs(spec, options?)` → `Router`

Mounts Scalar API Reference. Accepts [`ScalarOptions`](../api-openapi) (`title`, `theme`, `cdnUrl`).

### `serveSwaggerDocs(spec, options?)` → `Router`

Mounts Swagger UI. Accepts [`SwaggerOptions`](../api-openapi) (`title`, `cssCdnUrl`, `jsCdnUrl`).

Both routers expose:
- `GET /` — rendered HTML UI
- `GET /openapi.json` — raw spec as JSON

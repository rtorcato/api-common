---
title: api-ts-rest-express
description: Mount a ts-rest contract on Express and serve its OpenAPI docs (Scalar) in one call.
---

`@rtorcato/api-ts-rest-express` wires [ts-rest](https://ts-rest.com) into Express and
the api-common docs stack: `mountTsRest` registers a contract's routes with
`@ts-rest/express` and, optionally, generates an OpenAPI 3.1 doc from the contract
(`@ts-rest/open-api`) and serves it as Scalar docs via
[api-openapi-express](./api-openapi-express.md).

## Install

```bash
pnpm add @rtorcato/api-ts-rest-express @ts-rest/core @ts-rest/express @ts-rest/open-api express zod
```

:::note Version requirement
Requires `@ts-rest/*` **≥ 3.53.0-rc.1** — the first release supporting **zod 4** and
**express 5** (stable 3.52 pins zod 3 / express 4, which this repo doesn't use). Bump
the peer range to `^3.53` once it ships stable.
:::

`@ts-rest/*`, `express`, and `zod` are peer dependencies.

## Usage

```ts
import express from 'express'
import { z } from 'zod'
import { initContract, initServer, mountTsRest } from '@rtorcato/api-ts-rest-express'

const c = initContract()
const contract = c.router({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: { 200: z.object({ id: z.string(), name: z.string() }) },
  },
})

const s = initServer()
const router = s.router(contract, {
  getUser: async ({ params: { id } }) => ({ status: 200, body: { id, name: 'Ada' } }),
})

const app = express()
app.use(express.json())

mountTsRest(app, {
  contract,
  router,
  openapi: { info: { title: 'Users API', version: '1.0.0' } },
})
// → contract routes are live
// → GET /openapi.json  (OpenAPI 3.1 generated from the contract)
// → GET /docs          (Scalar API reference UI)
```

`initContract` / `initServer` are re-exported so the contract and server come from
one import.

## Options

`mountTsRest(app, options)`:

- `contract` / `router` — the ts-rest contract and its `s.router(...)` implementation.
- `endpointOptions?` — forwarded to `createExpressEndpoints` (`globalMiddleware`,
  `responseValidation`, …).
- `openapi?` — `{ info, options?, mount? }`. Generates an OpenAPI 3.1 doc from the
  contract and serves it; `options` goes to `generateOpenApi` (e.g.
  `{ setOperationId: true }`), `mount` overrides the docs paths/UI/theme.

## Related

- [api-openapi-express](./api-openapi-express.md) — the Scalar/Swagger mount this builds on

<!-- brand-kit:banner:start -->
<picture>
  <source media="(max-width: 640px)" srcset="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner-mobile.png">
  <img src="https://raw.githubusercontent.com/rtorcato/api-common/main/brand/banner.png" alt="api-common banner" width="1600">
</picture>
<!-- brand-kit:banner:end -->

# @rtorcato/api-ts-rest-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-ts-rest-express.svg)](https://www.npmjs.com/package/@rtorcato/api-ts-rest-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-ts-rest-express.svg)](https://www.npmjs.com/package/@rtorcato/api-ts-rest-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-ts-rest-express)](https://bundlephobia.com/package/@rtorcato/api-ts-rest-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[<img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy me a coffee" height="40">](https://buymeacoffee.com/rtorcato)

Mount a [ts-rest](https://ts-rest.com) contract on Express and serve its OpenAPI docs (Scalar) in one call — wires `@ts-rest/express` + `@ts-rest/open-api` into the api-common docs stack.

## Install

```sh
pnpm add @rtorcato/api-ts-rest-express @ts-rest/core @ts-rest/express @ts-rest/open-api express zod
```

> **Version note:** requires `@ts-rest/*` **≥ 3.53.0-rc.1**, which is the first release supporting **zod 4** and **express 5** (stable 3.52 pins zod 3 / express 4). Bump the peer range to `^3.53` once 3.53 ships stable.

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

`initContract` / `initServer` are re-exported so you can build the contract and server from one import.

## Default error responses

`withDefaultErrors` attaches the shared error envelope (`400`/`404`/`500`) to a route's `responses` so every contract documents errors the same way — matching the body emitted by [`@rtorcato/api-errors-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-errors-express) (`{ error, code, message, stack? }`). Statuses you define yourself win over the defaults.

```ts
import { withDefaultErrors } from '@rtorcato/api-ts-rest-express'

const contract = c.router({
  getUser: {
    method: 'GET',
    path: '/users/:id',
    pathParams: z.object({ id: z.string() }),
    responses: withDefaultErrors({ 200: z.object({ id: z.string(), name: z.string() }) }),
    // → 200 + 400 + 404 + 500 documented
  },
})
```

`defaultErrorSchema` is exported if you want the zod error schema on its own.

### Inference helpers

`RestRequest<T>` and `RestResponse<T>` alias ts-rest's `ServerInferRequest` / `ServerInferResponses` for typing handlers off a contract or route:

```ts
import type { RestRequest, RestResponse } from '@rtorcato/api-ts-rest-express'

type GetUserReq = RestRequest<typeof contract.getUser>
type GetUserRes = RestResponse<typeof contract.getUser>
```

## Options

`mountTsRest(app, options)`:

- `contract` / `router` — the ts-rest contract and its `s.router(...)` implementation.
- `endpointOptions?` — forwarded to `createExpressEndpoints` (`globalMiddleware`, `responseValidation`, …).
- `openapi?` — `{ info, options?, mount? }`. When present, generates an OpenAPI 3.1 doc from the contract and serves it via [`@rtorcato/api-openapi-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-express). `options` goes to `generateOpenApi` (e.g. `{ setOperationId: true }`); `mount` overrides the docs paths/UI/theme.

## Related

- [`@rtorcato/api-openapi-express`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-express) — the Scalar/Swagger mount this builds on
- [`@rtorcato/api-openapi-hono`](https://github.com/rtorcato/api-common/tree/main/packages/api-openapi-hono) — schema-first OpenAPI for Hono

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-ts-rest-express

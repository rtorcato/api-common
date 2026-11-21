---
title: Migrating from the old packages
description: Map each of the 37 old @rtorcato/api-* packages to its @rtorcato/api-common subpath, with the peers to install and the behaviour changes.
---

The 37 separate `@rtorcato/api-*` packages are replaced by one package, `@rtorcato/api-common`, with one subpath per old package. The old names are deprecated on npm and get no further releases.

## Steps

1. Install the new package: `pnpm add @rtorcato/api-common`.
2. Replace each import with the new subpath from the table below.
3. Install the peers the table lists for each subpath you use. See [Optional peers](./optional-peers.md) for version ranges.
4. Remove the old `@rtorcato/api-*` dependencies.

```ts
// before
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'

// after
import { NotFoundError } from '@rtorcato/api-common/errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-common/errors/express'
```

## What changed

- **No root export.** `import ... from '@rtorcato/api-common'` fails. Always import from a subpath, so you load only what you use.
- **Third-party libraries are optional peers.** `jsonwebtoken`, `cors`, `helmet`, `pino`, `dotenv`, `dotenv-expand`, `zod-error`, `supertest` and `zod` were bundled dependencies of some old packages. You now install them yourself. `zod` is needed by `config`, `logger`, `errors/express` and `errors/hono`, because the shared environment helpers import it.
- **Node.js 24 or newer.** The old docs said Node 22 or newer. The new package sets `engines.node` to `>=24`.
- **One version line.** All subpaths release together. A breaking change in one subpath bumps the major for everyone.
- **Two renames beyond the mechanical rule.** `@rtorcato/api-upload` is the Express and multer uploader, so it is now `upload/express`. `@rtorcato/api-express-utils` is now `express-utils`.
- **One shared errors module.** All subpaths share the same compiled `errors` code, so `instanceof HttpError` checks work across subpaths.
- **`@rtorcato/js-common` is installed for you.** It is the one real dependency of the package.

## Old name to new import

| Old package | New import | Peers you install |
|---|---|---|
| `@rtorcato/api-amqp` | `@rtorcato/api-common/amqp` | `amqplib` |
| `@rtorcato/api-auth` | `@rtorcato/api-common/auth` | `jsonwebtoken` |
| `@rtorcato/api-auth-express` | `@rtorcato/api-common/auth/express` | `express`, `jsonwebtoken` |
| `@rtorcato/api-auth-hono` | `@rtorcato/api-common/auth/hono` | `hono`, `jsonwebtoken` |
| `@rtorcato/api-config` | `@rtorcato/api-common/config` | `dotenv`, `dotenv-expand`, `zod` |
| `@rtorcato/api-cors-express` | `@rtorcato/api-common/cors/express` | `cors`, `express` |
| `@rtorcato/api-errors` | `@rtorcato/api-common/errors` | none |
| `@rtorcato/api-errors-express` | `@rtorcato/api-common/errors/express` | `express`, `zod` |
| `@rtorcato/api-errors-hono` | `@rtorcato/api-common/errors/hono` | `hono`, `zod` |
| `@rtorcato/api-express-utils` | `@rtorcato/api-common/express-utils` | `express` |
| `@rtorcato/api-graceful-shutdown` | `@rtorcato/api-common/graceful-shutdown` | none |
| `@rtorcato/api-health` | `@rtorcato/api-common/health` | none |
| `@rtorcato/api-health-express` | `@rtorcato/api-common/health/express` | `express` |
| `@rtorcato/api-health-hono` | `@rtorcato/api-common/health/hono` | `hono` |
| `@rtorcato/api-http` | `@rtorcato/api-common/http` | none |
| `@rtorcato/api-logger` | `@rtorcato/api-common/logger` | `pino`, `zod` |
| `@rtorcato/api-mcp` | `@rtorcato/api-common/mcp` | `@modelcontextprotocol/sdk` |
| `@rtorcato/api-openapi` | `@rtorcato/api-common/openapi` | `zod` |
| `@rtorcato/api-openapi-express` | `@rtorcato/api-common/openapi/express` | `express`, `swagger-jsdoc`, `zod` |
| `@rtorcato/api-openapi-hono` | `@rtorcato/api-common/openapi/hono` | `hono`, `@hono/zod-openapi`, `@scalar/hono-api-reference` |
| `@rtorcato/api-rate-limit` | `@rtorcato/api-common/rate-limit` | none |
| `@rtorcato/api-rate-limit-express` | `@rtorcato/api-common/rate-limit/express` | `express` |
| `@rtorcato/api-rate-limit-hono` | `@rtorcato/api-common/rate-limit/hono` | `hono` |
| `@rtorcato/api-rate-limit-redis` | `@rtorcato/api-common/rate-limit/redis` | `ioredis` |
| `@rtorcato/api-response` | `@rtorcato/api-common/response` | `zod` |
| `@rtorcato/api-security-express` | `@rtorcato/api-common/security/express` | `express`, `helmet` |
| `@rtorcato/api-testing` | `@rtorcato/api-common/testing` | `jsonwebtoken`, `supertest` |
| `@rtorcato/api-timeout` | `@rtorcato/api-common/timeout` | none |
| `@rtorcato/api-timeout-express` | `@rtorcato/api-common/timeout/express` | `express` |
| `@rtorcato/api-timeout-hono` | `@rtorcato/api-common/timeout/hono` | `hono` |
| `@rtorcato/api-ts-rest-express` | `@rtorcato/api-common/ts-rest/express` | `express`, `@ts-rest/core`, `@ts-rest/express`, `@ts-rest/open-api`, `swagger-jsdoc`, `zod` |
| `@rtorcato/api-upload` | `@rtorcato/api-common/upload/express` | `express`, `multer`, `multer-s3`, `@aws-sdk/client-s3` |
| `@rtorcato/api-upload-hono` | `@rtorcato/api-common/upload/hono` | `hono`, `@aws-sdk/client-s3` |
| `@rtorcato/api-validation` | `@rtorcato/api-common/validation` | `zod`, `zod-error` |
| `@rtorcato/api-webhooks` | `@rtorcato/api-common/webhooks` | none |
| `@rtorcato/api-webhooks-express` | `@rtorcato/api-common/webhooks/express` | `express` |
| `@rtorcato/api-webhooks-hono` | `@rtorcato/api-common/webhooks/hono` | `hono` |

The `@rtorcato/api-` guides on this site keep their old file names, so existing links to them still work. The content now shows the new imports.

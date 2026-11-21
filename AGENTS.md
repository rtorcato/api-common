<!-- Generated from skills/api-common/SKILL.md by scripts/sync-agents.mjs — do not edit by hand; run `pnpm sync:agents`. -->

# Using @rtorcato/api-common

`@rtorcato/api-common` is a single, ESM-only package of building blocks for Node.js APIs. Each feature is a subpath export, for example `@rtorcato/api-common/errors`. Every third-party library is an optional peer dependency, so you install only what the subpaths you import need.

## Rules

1. **Core subpath = framework-agnostic logic; `/express` and `/hono` = the adapter.** For any concern with a framework split (auth, errors, health, openapi, rate-limit, timeout, webhooks), import the core subpath for your logic and the adapter subpath for your framework.
   ```ts
   // Express
   import { UnauthorizedError } from '@rtorcato/api-common/errors'
   import { errorHandler, notFoundHandler } from '@rtorcato/api-common/errors/express'
   ```
   ```ts
   // Hono: same core, different adapter
   import { UnauthorizedError } from '@rtorcato/api-common/errors'
   import { errorHandler, notFoundHandler } from '@rtorcato/api-common/errors/hono'
   ```

2. **Third-party libraries are optional peers: you install them.** Install the package once, then add the peers the subpaths you import need (`express`, `hono`, `zod`, `jsonwebtoken` and so on). The docs site has a page listing which subpath needs which peer.
   ```sh
   pnpm add @rtorcato/api-common express zod
   ```

3. **Always import from a subpath.** There is no root export, so `import ... from '@rtorcato/api-common'` fails. Public API is only what the `exports` map exposes. Don't reach into `dist/` or internal modules.

4. **The error contract: throw typed errors, register the handler once.** Throw an `HttpError` subclass from `@rtorcato/api-common/errors` (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, ...) from anywhere in your code. Register the adapter's `errorHandler` and `notFoundHandler` so they serialize to one consistent JSON body. On Express, wrap async route handlers with `asyncHandler` so thrown or rejected errors reach the handler.
   ```ts
   import { asyncHandler } from '@rtorcato/api-common/errors/express'
   import { NotFoundError } from '@rtorcato/api-common/errors'

   app.get('/users/:id', asyncHandler(async (req, res) => {
     const user = await findUser(req.params.id)
     if (!user) throw new NotFoundError('User not found')
     res.json(user)
   }))
   app.use(notFoundHandler)  // last
   app.use(errorHandler)     // very last
   ```

5. **Wrap success bodies with the same envelope.** Use `ok(data)` from `@rtorcato/api-common/response` for a consistent success shape, and `successSchema()` to describe it in OpenAPI or zod.

6. **ESM-only, Node 24 or newer.** The package ships `"type": "module"` and no CJS build. Consume it from an ESM (or bundled) project.

7. **Migrating from the old packages.** The 37 `@rtorcato/api-*` packages are deprecated. Map an old name to its new subpath with the migration page on the docs site.

## Subpath map

Concerns with a **core + `/express` + `/hono` split**:

| Concern | Core | Express adapter | Hono adapter |
|---|---|---|---|
| Errors | `errors` (`HttpError` + subclasses, `toErrorResponse`) | `errors/express` (`errorHandler`, `notFoundHandler`, `asyncHandler`) | `errors/hono` |
| Auth (JWT) | `auth` (`signToken`, `verifyToken`, `findToken`) | `auth/express` (`authMiddleware`, `optionalAuthMiddleware`) | `auth/hono` |
| Health probes | `health` (liveness/readiness registry) | `health/express` | `health/hono` |
| OpenAPI docs | `openapi` (Scalar HTML from a spec) | `openapi/express` | `openapi/hono` (schema-first via `@hono/zod-openapi`) |
| Rate limit | `rate-limit` (sliding window) | `rate-limit/express` | `rate-limit/hono` |
| Timeout | `timeout` (503 past a deadline) | `timeout/express` | `timeout/hono` |
| Webhooks | `webhooks` (HMAC verify) | `webhooks/express` (raw-body capture) | `webhooks/hono` |

Framework-agnostic (use directly):

| Subpath | What it does |
|---|---|
| `response` | `ok()` success envelope + `successSchema`/`errorSchema` zod helpers |
| `config` | `loadEnv()`: dotenv + zod env validation |
| `logger` | `createLogger()`: pino factory |
| `http` | `createHttpClient()`: typed fetch client, errors normalized to `errors` |
| `validation` | `validate()` + `formatZodError()`: zod request validation |
| `graceful-shutdown` | SIGTERM/SIGINT drain with ordered cleanup + hard timeout |
| `amqp` | Typed amqplib publisher/consumer for RabbitMQ |
| `mcp` | Result helpers for `@modelcontextprotocol/sdk` servers |
| `rate-limit/redis` | Redis store for the rate limiter |

Express-only (Hono ships an equivalent built-in, so no Hono adapter):

| Subpath | What it does | Hono equivalent |
|---|---|---|
| `cors/express` | CORS with sane defaults | `hono/cors` |
| `security/express` | helmet security headers | `hono/secure-headers` |
| `express-utils` | client-IP + route-logging helpers | none |
| `ts-rest/express` | mount a ts-rest contract + serve its OpenAPI docs | none |
| `upload/express` | S3 upload via multer-s3, typed errors | `upload/hono` |

Dev/test: `testing` (supertest re-export, JWT auth fixtures, response matchers).

For usage and full API, see the [docs site](https://docs.torcato.dev/api-common/) or the runnable `apps/example-express`, `apps/example-hono` and `apps/example-mcp`.

---
name: api-common
description: Use when building a Node.js HTTP API (Express, Hono, or framework-agnostic) in a project that depends on the @rtorcato/api-* packages. Guides the base-vs-adapter package split, framework peer-deps, the api-errors throw/handler contract, and the api-response success envelope.
---

# Using @rtorcato/api-* (api-common)

`api-common` is a monorepo of small, single-purpose, ESM-only packages for building Node.js APIs. Each `@rtorcato/api-*` package is published and consumed independently — install only the ones you use.

## Rules

1. **Base package = framework-agnostic logic; `-express` / `-hono` = the adapter.** For any concern with a framework split (auth, errors, health, openapi, rate-limit, timeout, webhooks), install the **base package plus the adapter for your framework**. Put your logic against the base; wire it with the adapter.
   ```ts
   // Express
   import { UnauthorizedError } from '@rtorcato/api-errors'
   import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
   ```
   ```ts
   // Hono — same base, different adapter
   import { UnauthorizedError } from '@rtorcato/api-errors'
   import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'
   ```

2. **Frameworks are peer dependencies — you install them.** `express` / `hono` (and framework plugins like `@hono/zod-openapi`) are peer-deps of the adapter packages. Add them to your own project; the adapter won't pull a version for you.
   ```sh
   pnpm add @rtorcato/api-errors @rtorcato/api-errors-express express
   ```

3. **Import from the package root.** Each package has a single `.` export (no subpaths). Public API is only what a package's `exports` field exposes — don't reach into `dist/` or internal modules.

4. **The error contract: throw typed errors, register the handler once.** Throw an `@rtorcato/api-errors` `HttpError` subclass (`BadRequestError`, `UnauthorizedError`, `NotFoundError`, …) from anywhere in your code. Register the framework adapter's `errorHandler` + `notFoundHandler` so they serialize to one consistent JSON body. On Express, wrap async route handlers with `asyncHandler` so thrown/rejected errors reach the handler.
   ```ts
   import { asyncHandler } from '@rtorcato/api-errors-express'
   import { NotFoundError } from '@rtorcato/api-errors'

   app.get('/users/:id', asyncHandler(async (req, res) => {
     const user = await findUser(req.params.id)
     if (!user) throw new NotFoundError('User not found')
     res.json(user)
   }))
   app.use(notFoundHandler)  // last
   app.use(errorHandler)     // very last
   ```

5. **Wrap success bodies with the same envelope.** Use `ok(data)` from `@rtorcato/api-response` for a consistent success shape, and `successSchema()` to describe it in OpenAPI/zod.

6. **ESM-only.** These packages ship `"type": "module"` and no CJS build. Consume from an ESM (or bundled) project.

## Package map

Concerns with a **base + `-express`/`-hono` split** — install the base and your framework's adapter:

| Concern | Base | Express adapter | Hono adapter |
|---|---|---|---|
| Errors | `api-errors` (`HttpError` + subclasses, `toErrorResponse`) | `api-errors-express` (`errorHandler`, `notFoundHandler`, `asyncHandler`) | `api-errors-hono` |
| Auth (JWT) | `api-auth` (`signToken`, `verifyToken`, `findToken`) | `api-auth-express` (`authMiddleware`, `optionalAuthMiddleware`) | `api-auth-hono` |
| Health probes | `api-health` (liveness/readiness registry) | `api-health-express` | `api-health-hono` |
| OpenAPI docs | `api-openapi` (Scalar HTML from a spec) | `api-openapi-express` | `api-openapi-hono` (schema-first via `@hono/zod-openapi`) |
| Rate limit | `api-rate-limit` (sliding window) | `api-rate-limit-express` | `api-rate-limit-hono` |
| Timeout | `api-timeout` (503 past a deadline) | `api-timeout-express` | `api-timeout-hono` |
| Webhooks | `api-webhooks` (HMAC verify) | `api-webhooks-express` (raw-body capture) | `api-webhooks-hono` |

Framework-agnostic (no adapter needed — use directly):

| Package | What it does |
|---|---|
| `api-response` | `ok()` success envelope + `successSchema`/`errorSchema` zod helpers |
| `api-config` | `loadEnv()` — dotenv + zod env validation |
| `api-logger` | `createLogger()` — pino factory |
| `api-http` | `createHttpClient()` — typed fetch client, errors normalized to `api-errors` |
| `api-validation` | `validate()` + `formatZodError()` — zod request validation |
| `api-graceful-shutdown` | SIGTERM/SIGINT drain with ordered cleanup + hard timeout |
| `api-amqp` | Typed amqplib publisher/consumer for RabbitMQ |

Express-only (Hono ships an equivalent built-in, so no adapter):

| Package | What it does | Hono equivalent |
|---|---|---|
| `api-cors-express` | CORS with sane defaults | `hono/cors` |
| `api-security-express` | helmet security headers | `hono/secure-headers` |
| `api-express-utils` | client-IP + route-logging helpers | — |
| `api-ts-rest-express` | mount a ts-rest contract + serve its OpenAPI docs | — |
| `api-upload` | S3 upload via multer-s3, typed errors | — |

Dev/test: `api-testing` — supertest re-export, JWT auth fixtures, response matchers.

For per-package usage and full API, see each `packages/<name>/README.md`, the [docs site](https://rtorcato.github.io/api-common), or the runnable `apps/example-express`, `apps/example-hono`, and `apps/example-mcp`.

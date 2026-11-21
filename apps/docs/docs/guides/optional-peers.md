---
title: Optional peer dependencies
description: Which third-party libraries each @rtorcato/api-common subpath needs, with the supported version ranges.
---

`@rtorcato/api-common` installs one dependency for you, `@rtorcato/js-common`. Every third-party library is an **optional peer dependency**, so your project installs only the libraries that the subpaths you import actually use. Nothing is loaded until you import its subpath, and the package has no root export.

```bash
# core subpaths with no peers (errors, health, http, rate-limit, ...)
pnpm add @rtorcato/api-common

# Express adapters
pnpm add @rtorcato/api-common express zod

# Hono adapters
pnpm add @rtorcato/api-common hono zod
```

If you import a subpath and its peer is missing, Node fails with a "cannot find package" error that names the library. Install it with your package manager and try again.

## Peers by subpath

A subpath marked `none` works with no extra installs.

| Subpath | Peers you install |
|---|---|
| `amqp` | `amqplib` |
| `auth` | `jsonwebtoken` |
| `auth/express` | `express`, `jsonwebtoken` |
| `auth/hono` | `hono`, `jsonwebtoken` |
| `config` | `dotenv`, `dotenv-expand`, `zod` |
| `cors/express` | `cors`, `express` |
| `errors` | none |
| `errors/express` | `express`, `zod` |
| `errors/hono` | `hono`, `zod` |
| `express-utils` | `express` |
| `graceful-shutdown` | none |
| `health` | none |
| `health/express` | `express` |
| `health/hono` | `hono` |
| `http` | none |
| `logger` | `pino`, `zod` |
| `mcp` | `@modelcontextprotocol/sdk` |
| `openapi` | `zod` |
| `openapi/express` | `express`, `swagger-jsdoc`, `zod` |
| `openapi/hono` | `hono`, `@hono/zod-openapi`, `@scalar/hono-api-reference` |
| `rate-limit` | none |
| `rate-limit/express` | `express` |
| `rate-limit/hono` | `hono` |
| `rate-limit/redis` | `ioredis` |
| `response` | `zod` |
| `security/express` | `express`, `helmet` |
| `testing` | `jsonwebtoken`, `supertest` |
| `timeout` | none |
| `timeout/express` | `express` |
| `timeout/hono` | `hono` |
| `ts-rest/express` | `express`, `@ts-rest/core`, `@ts-rest/express`, `@ts-rest/open-api`, `swagger-jsdoc`, `zod` |
| `upload/express` | `express`, `multer`, `multer-s3`, `@aws-sdk/client-s3` |
| `upload/hono` | `hono`, `@aws-sdk/client-s3` |
| `validation` | `zod`, `zod-error` |
| `webhooks` | none |
| `webhooks/express` | `express` |
| `webhooks/hono` | `hono` |

## Peers and supported versions

| Peer | Supported range | Needed by |
|---|---|---|
| `@aws-sdk/client-s3` | `^3.0.0` | `upload/express`, `upload/hono` |
| `@hono/zod-openapi` | `^1.0.0` | `openapi/hono` |
| `@modelcontextprotocol/sdk` | `^1.32.2` | `mcp` |
| `@scalar/hono-api-reference` | `^0.11.0 || ^0.12.0` | `openapi/hono` |
| `@ts-rest/core` | `>=3.53.0-rc.1 <4` | `ts-rest/express` |
| `@ts-rest/express` | `>=3.53.0-rc.1 <4` | `ts-rest/express` |
| `@ts-rest/open-api` | `>=3.53.0-rc.1 <4` | `ts-rest/express` |
| `amqplib` | `^0.10.0 || ^2.0.0` | `amqp` |
| `cors` | `^2.8.5` | `cors/express` |
| `dotenv` | `^18.0.9` | `config` |
| `dotenv-expand` | `^13.0.0` | `config` |
| `express` | `^4.18.0 || ^5.0.0` | `auth/express`, `cors/express`, `errors/express`, `express-utils`, `health/express`, `openapi/express`, `rate-limit/express`, `security/express`, `timeout/express`, `ts-rest/express`, `upload/express`, `webhooks/express` |
| `helmet` | `^8.3.0` | `security/express` |
| `hono` | `^4.0.0` | `auth/hono`, `errors/hono`, `health/hono`, `openapi/hono`, `rate-limit/hono`, `timeout/hono`, `upload/hono`, `webhooks/hono` |
| `ioredis` | `^5.0.0 || ^6.0.0` | `rate-limit/redis` |
| `jsonwebtoken` | `^9.0.2` | `auth`, `auth/express`, `auth/hono`, `testing` |
| `multer` | `^2.0.0` | `upload/express` |
| `multer-s3` | `^3.0.0` | `upload/express` |
| `pino` | `^10.4.0` | `logger` |
| `supertest` | `^7.3.1` | `testing` |
| `swagger-jsdoc` | `^6.0.0` | `openapi/express`, `ts-rest/express` |
| `zod` | `^4.0.0` | `config`, `errors/express`, `errors/hono`, `logger`, `openapi`, `openapi/express`, `response`, `ts-rest/express`, `validation` |
| `zod-error` | `^2.0.0` | `validation` |

`pino-pretty` is also an optional peer. Install it as a dev dependency if you want the pretty-printed output that the `logger` subpath uses in development.

## Notes

- **`zod`** is needed by `config`, `logger`, `errors/express`, `errors/hono`, `openapi`, `openapi/express`, `response`, `validation` and `ts-rest/express`.
- **Express** is needed by every `/express` subpath, and by `express-utils`. **Hono** is needed by every `/hono` subpath. Subpaths never import a framework they don't name, so an Express app never loads Hono.
- **Testing** needs `jsonwebtoken` and `supertest` in your dev dependencies.
- If you are moving from the old packages, see [Migrating from the old packages](./migration.md).

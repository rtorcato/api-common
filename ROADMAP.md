# Roadmap

High-level plan for `api-common`. Granular task tracking lives in
[`TODOS.md`](./TODOS.md); package work is tracked in epics
[#26](https://github.com/rtorcato/api-common/issues/26) and
[#27](https://github.com/rtorcato/api-common/issues/27).

Today the repo ships three packages: `api-errors`, `api-errors-express`,
`api-errors-hono`.

Cloudflare Workers helpers live in a separate repo:
[`cf-common`](https://github.com/rtorcato/cf-common) (depends on the
edge-safe cores here).

## Phases

1. **Repo hygiene / discoverability** (issues #17–#25) — npm
   `repository`/`keywords`, repo topics, publish `--provenance`, publint +
   `@arethetypeswrong/cli`, issue/PR templates, CODEOWNERS, CONTRIBUTING,
   branch protection. Unblocks clean publishing.
2. **Core packages** (framework-agnostic, highest reuse) — `api-config`,
   `api-logger` (+ request-id), `api-validation`, `api-types`, `api-auth`
   (jose), `api-http`.
3. **Express / Hono adapters** — `api-auth-express`, `api-cors-express`,
   `api-rate-limit-express`/`-hono`, `api-security-express`,
   `api-ts-rest-express`, `api-express-utils`, and the **OpenAPI family**
   (see below).
4. **Ops packages** — `api-health`, `api-graceful-shutdown`, `api-testing`,
   `api-amqp`, `api-upload` (S3 / multer-s3).
5. **Deferred (Tier 2)** — open only when a consumer hits the need:
   `api-pagination`, `api-metrics`, `api-otel`, `api-cache`,
   `api-idempotency`.

## OpenAPI / Swagger docs (priority)

Goal: **every API project ships well-documented, never-drifting docs.**
Principle — **schema-first**: derive the OpenAPI spec from the same Zod schemas
used by `api-validation`, so docs can't drift from validation. Default docs UI
is **Scalar** (`@scalar/*`); `swagger-ui-express` is the legacy/JSDoc fallback.

| Package | Role |
| --- | --- |
| `api-openapi` | framework-agnostic core: build the OpenAPI 3.1 document + serve the docs HTML (Scalar or Swagger UI) |
| `api-openapi-express` | mount on Express — Scalar + `swagger-ui-express`; optional `swagger-jsdoc` ingestion for legacy JSDoc projects |
| `api-openapi-hono` | `@hono/zod-openapi` + `@scalar/hono-api-reference` — the gold-standard schema-first path |

## New packages not yet in epics #26 / #27

| Package | Need |
| --- | --- |
| `api-health` | liveness/readiness handlers (`/healthz`, `/readyz`) |
| `api-graceful-shutdown` | SIGTERM drain for containers/k8s |
| `api-security-express` | `helmet` wrapper (Hono has `secureHeaders` built in) |
| `api-openapi` / `-express` / `-hono` | OpenAPI doc builder + Scalar/Swagger UI (see above) |
| `api-upload` | S3 upload via `multer-s3` (public/private ACL, cache headers) |
| `api-express-utils` | `getIP` (X-Forwarded-For), `logRoutes` (print routes at boot) |
| `asyncHandler` | fold into `api-errors-express` — forwards async rejections to the error handler |
| request-id / correlation-ID | fold into `api-logger`, not its own package |



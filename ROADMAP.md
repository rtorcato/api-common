# Roadmap

High-level plan for `api-common`. Granular task tracking lives in
[`TODOS.md`](./TODOS.md); package work is tracked in epics
[#26](https://github.com/rtorcato/api-common/issues/26) and
[#27](https://github.com/rtorcato/api-common/issues/27).

Today the repo ships 15 packages: `api-errors`, `api-errors-express`,
`api-errors-hono`, `api-config`, `api-logger`, `api-rate-limit`,
`api-rate-limit-express`, `api-rate-limit-hono`, `api-response`,
`api-validation`, `api-auth`, `api-auth-express`, `api-cors-express`,
`api-express-utils`, and `api-testing`.

Cloudflare Workers helpers live in a separate repo:
[`cf-common`](https://github.com/rtorcato/cf-common) (depends on the
edge-safe cores here).

## Phases

1. **Repo hygiene / discoverability** (issues #17–#25) — npm
   `repository`/`keywords`, repo topics, publish `--provenance`, publint +
   `@arethetypeswrong/cli`, issue/PR templates, CODEOWNERS, CONTRIBUTING,
   branch protection. Unblocks clean publishing.
2. **Core packages** (framework-agnostic, highest reuse) — `api-config` ✅,
   `api-logger` ✅ (+ request-id), `api-validation` ✅, `api-types`,
   `api-auth` ✅ (framework-agnostic **core**: sign/verify JWTs, extract
   Bearer/cookie tokens, no framework imports), `api-http`.
3. **Express / Hono adapters** — `api-auth-express` ✅ / `api-auth-hono`,
   `api-cors-express` ✅, `api-rate-limit-express` ✅ / `api-rate-limit-hono` ✅,
   `api-security-express`, `api-ts-rest-express`, `api-express-utils` ✅, and
   the **OpenAPI family** (see below).
4. **Ops packages** — `api-health`, `api-graceful-shutdown`, `api-testing` ✅,
   `api-amqp`, `api-upload` (S3 / multer-s3).
5. **Deferred (Tier 2)** — open only when a consumer hits the need:
   `api-pagination`, `api-metrics`, `api-otel`, `api-cache`,
   `api-idempotency`.

## Milestones

The phases above describe *scope*; GitHub
[milestones](https://github.com/rtorcato/api-common/milestones) group that work
into *releases*. They sit alongside the phases — they don't replace them.

| Milestone | Covers |
| --- | --- |
| [Beta](https://github.com/rtorcato/api-common/milestone/1) | A developer can build a fully-documented Express/Hono API end-to-end. Phase 2–3 progress: `api-auth` ✅, `api-auth-express` ✅, `api-cors-express` ✅, `api-express-utils` ✅, `asyncHandler` ✅. Remaining: `api-auth-hono`, `api-types`, `api-http`, the OpenAPI family, and runnable example apps. Tracked by epics #26 / #27. |
| [1.0](https://github.com/rtorcato/api-common/milestone/2) | Stable release — public API frozen, plus Phase 4 ops packages (`api-upload`, `api-health`, `api-graceful-shutdown`, `api-testing`). |
| Post-1.0 | The Phase 5 deferred (Tier 2) packages, opened when a consumer hits the need. |

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
| `api-upload` | S3 upload via `multer-s3` (public/private ACL, cache headers) — see AWS family below |
| request-id / correlation-ID | fold into `api-logger`, not its own package |

## AWS family — narrow, never monolithic

No `api-aws` blanket wrapper: AWS SDK v3 is already modular, so wrapping it only
adds drift. One package per service-pattern actually repeated, each with
`@aws-sdk/client-*` as a **peer** dep.

| Package | Role |
| --- | --- |
| `api-upload` | S3 upload (public/private ACL, cache headers) — seeded from old `AWS/S3/uploader.ts` |
| `api-email` | SES templated send — *candidate, build when repeated* |
| (presigned URLs) | S3 presigned GET/PUT helpers — *candidate, build when repeated* |

## Out of scope

- **ecom (cart / orders / products / checkout)** — domain logic, not API
  infrastructure, and app-specific (no model reuse across projects). Belongs in
  a per-project or separate domain repo, not `api-common`.
  - money / currency math → `@rtorcato/js-common` (framework-agnostic helper)
  - Stripe **webhook signature verification** → only justifies a focused
    `api-stripe-webhook` package *if* it's actually repeated; that's infra
    (verifying an HTTP request), not domain.



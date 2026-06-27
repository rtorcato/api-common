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
   `api-openapi-express`, `api-ts-rest-express`.
4. **Ops packages** — `api-health`, `api-graceful-shutdown`, `api-testing`,
   `api-amqp`.
5. **Deferred (Tier 2)** — open only when a consumer hits the need:
   `api-pagination`, `api-metrics`, `api-otel`, `api-cache`,
   `api-idempotency`.

## New packages not yet in epics #26 / #27

| Package | Need |
| --- | --- |
| `api-health` | liveness/readiness handlers (`/healthz`, `/readyz`) |
| `api-graceful-shutdown` | SIGTERM drain for containers/k8s |
| `api-security-express` | `helmet` wrapper (Hono has `secureHeaders` built in) |
| request-id / correlation-ID | fold into `api-logger`, not its own package |



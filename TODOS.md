# TODOS

Roadmap derived from the old [`gitlab.com/rtorcato/api-common`](https://gitlab.com/rtorcato/api-common) dep list. Each line is a candidate package to lift over.

## Packages to scaffold

- [ ] `@rtorcato/api-logger` — pino + pino-http request logger. Framework-agnostic core; consider a thin `api-logger-express` adapter if needed.
- [ ] `@rtorcato/api-validation` — zod-based request validation helpers (body/query/params) with pretty error formatting (zod-error).
- [ ] `@rtorcato/api-auth` — JWT sign/verify helpers (jsonwebtoken). Framework-agnostic.
- [ ] `@rtorcato/api-auth-express` — Express middleware over `api-auth`.
- [ ] `@rtorcato/api-cors-express` — Express CORS wrapper with sane defaults.
- [ ] `@rtorcato/api-http` — axios wrapper / typed HTTP client helpers.
- [ ] `@rtorcato/api-amqp` — amqplib publisher/consumer helpers.
- [ ] `@rtorcato/api-openapi-express` — swagger-ui-express mount helper.
- [ ] `@rtorcato/api-ts-rest-express` — `@ts-rest/express` + `@ts-rest/open-api` wiring helpers.
- [ ] Hono adapters for each new core package, mirroring the `api-errors` / `api-errors-hono` pattern. Evaluate per package — only adapt where Hono integration adds real value (e.g. logger, auth, validation).

## Tooling / repo

- [ ] Publish pipeline — port `semantic-release` config from the old repo and wire per-package releases (changesets or semantic-release-monorepo).
- [ ] Resolve the `@rtorcato/js-tooling` peer-dep warning (wants `@commitlint/cli@^20`, we have `^19`).
- [ ] Pin `@rtorcato/js-tooling` in root `devDependencies` instead of `"latest"`.
- [ ] Decide whether the existing root CI workflow needs per-package matrix builds.

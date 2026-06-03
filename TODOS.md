# TODOS

Roadmap derived from the old [`gitlab.com/rtorcato/api-common`](https://gitlab.com/rtorcato/api-common) dep list, plus gaps surfaced while shipping v0.1.0–0.1.1. Each line is a candidate to act on.

## Packages to scaffold

### Ported from the old gitlab repo

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

### Beyond the old repo (worth considering)

- [ ] `@rtorcato/api-config` — env var loading + zod parsing (old repo used `dotenv` + `dotenv-cli` raw).
- [ ] `@rtorcato/api-testing` — supertest helpers, request factories, common assertions for Express + Hono.
- [ ] `@rtorcato/api-rate-limit-express` / `-hono` — common need, no equivalent in old repo.
- [ ] `@rtorcato/api-types` (optional) — shared response shapes (e.g. the `{ error, code, message }` envelope already standardized across `api-errors-express` / `api-errors-hono`).

## Tooling / repo

### Done

- [x] Publish pipeline — changesets + `.github/workflows/release.yml`. Push to `main` opens a Version Packages PR; merging publishes to npm via `NPM_TOKEN` repo secret.
- [x] Pin `@rtorcato/js-tooling` in root `devDependencies` instead of `"latest"`.

### npm discoverability

- [ ] Add `repository`, `bugs`, `homepage`, `keywords` to all 3 package.jsons. Without these the npm UI shows broken "Repository" links and search ranking suffers. Needs a v0.1.2 patch release after editing.
- [ ] Set GitHub repo `description` + `topics` (e.g. `typescript`, `monorepo`, `express`, `hono`, `http-errors`, `nodejs`, `api`). Currently both are empty (`gh api repos/rtorcato/api-common --jq '{description, topics}'` → `{description: null, topics: []}`).
- [ ] Add `--provenance` to the changesets publish step. The release workflow already has `id-token: write` so this is a one-line change. Gives the green "Provenance" badge on npm.

### CI / quality gates

- [ ] Re-enable CodeQL workflow once the repo visibility decision is made (public unlocks free code scanning; private requires GHAS). Was removed because code scanning isn't enabled and every run failed on the upload step.

- [ ] Triage 7 open Dependabot PRs (`#1`–`#7`). Several cross majors:
  - `#1` `github/codeql-action` 3 → 4
  - `#2` `pnpm/action-setup` 4 → 6
  - `#3` `actions/checkout` 4 → 6
  - `#4` `actions/setup-node` 4 → 6
  - `#5` `lint-staged` 15 → 17
  - `#6` `@commitlint/cli` 19 → 21 (would also fix `js-tooling`'s peer-dep warning)
  - `#7` `@types/supertest` 6 → 7
- [ ] Migrate workflow actions to Node 24 baseline. Largely resolved by merging Dependabot PRs `#1`–`#4` above; hard deadline is GitHub's ~Sept 16 2026 Node 20 removal.
- [ ] Add `publint` + `@arethetypeswrong/cli` to CI. Catches `exports`-map mistakes before they ship.
- [ ] Resolve the `@rtorcato/js-tooling` peer-dep warning (wants `@commitlint/cli@^20`, we have `^19`). Likely auto-fixed by Dependabot PR `#6`.
- [ ] Decide whether the existing root CI workflow needs per-package matrix builds.
- [ ] Verify (one-time) that `LICENSE` ships inside each package tarball — the v0.1.0 dry-run showed `1.1kB LICENSE` in the tarball, so probably already fine. Confirm with `npm view @rtorcato/api-errors@0.1.1 dist.tarball`, download, `tar tzf`.

## OSS hygiene

- [ ] `SECURITY.md` — disclosure policy + contact email.
- [ ] `CONTRIBUTING.md` — pnpm setup, `pnpm changeset` flow, conventional-commit rules.
- [ ] `CODEOWNERS` — auto-assign reviewers on PRs.
- [ ] `.github/ISSUE_TEMPLATE/bug.md`, `feature.md`.
- [ ] `.github/PULL_REQUEST_TEMPLATE.md`.

## Open questions

- [ ] Make the repo public or keep private? Public unblocks the GitHub URLs in published npm READMEs (they 404 today for non-collaborators) and enables free branch protection. Private requires stripping GH links from package READMEs.
- [ ] Can we delete <https://github.com/rtorcato/hono-open-api-starter>? Does this library replace the need for that repo? If so delete the repo.
- [ ] Do we need <https://github.com/rtorcato/stoker>?

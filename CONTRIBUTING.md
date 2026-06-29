# Contributing

Thanks for your interest in `api-common` — a monorepo of reusable Node.js
library packages for building API projects (Express, Hono, and other Node HTTP
frameworks).

## Prerequisites

- Node.js >= 22
- [pnpm](https://pnpm.io) (the only supported package manager — never `npm` or `yarn`)

## Setup

```bash
pnpm install
```

## Workflow

1. Create a branch off `main` (e.g. `feat/api-auth`, `fix/logger-level`).
2. Make your change in the relevant `packages/<name>`.
3. Add or update tests (Vitest).
4. Add a changeset describing the change (see below).
5. Open a pull request — CI must pass and the PR template checklist completed.

## Commands

Run from the repo root unless noted.

| Task | Command |
| --- | --- |
| Test everything | `pnpm -r test` |
| Test one package | `pnpm --filter <pkg-name> test` |
| Typecheck | `pnpm -r typecheck` |
| Build | `pnpm -r build` |
| Lint + format check | `pnpm check` |
| Autofix | `pnpm check:fix` |

## Conventions

- **Framework-agnostic where possible.** Framework-specific code (Express/Hono)
  belongs in its own adapter package; keep shared packages free of framework
  imports. Framework deps go in `peerDependencies`.
- **Reuse `@rtorcato/js-common`** for generic helpers (env checks, date/uuid/
  crypto/string utils, retries) instead of reinventing them here.
- **Public API** is whatever a package's `exports` field exposes. Internal
  modules are not part of the contract.
- Ask before adding new runtime dependencies.

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org), enforced by
commitlint. The commit **body** must wrap at 72 characters.

```
feat(api-errors): add 422/429/503 error classes
```

## Changesets

Consumer-facing changes need a changeset so the package version bumps on
release:

```bash
pnpm changeset
```

Pick the affected package(s) and bump type (patch/minor/major), then commit the
generated file under `.changeset/`.

## Releasing

Releases are automated via [changesets](https://github.com/changesets/changesets)
and the `Release` GitHub Action — merging changesets to `main` opens a version
PR, and merging that publishes to npm. Maintainers handle this.

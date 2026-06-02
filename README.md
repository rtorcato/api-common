# api-common

A monorepo of reusable Node.js library packages for building API projects. Targets Express, Hono, and other Node HTTP frameworks. Each package under `packages/` is independently consumable.

The old single-package repo lives at https://gitlab.com/rtorcato/api-common and is being broken up and migrated here.

## Stack

- **pnpm** workspaces
- **TypeScript** (configs extend [`@rtorcato/js-tooling`](https://www.npmjs.com/package/@rtorcato/js-tooling))
- **Vitest** for tests
- **Biome** for lint + format
- **Husky** + **commitlint** (conventional commits) on commit
- **GitHub Actions** for CI + CodeQL, **Dependabot** for updates

## Packages

| Package | npm | Description |
| --- | --- | --- |
| [`@rtorcato/api-errors`](./packages/api-errors) | [![npm](https://img.shields.io/npm/v/@rtorcato/api-errors.svg)](https://www.npmjs.com/package/@rtorcato/api-errors) | Framework-agnostic HTTP error classes (`HttpError` + 400/401/403/404/409/500 subclasses). |
| [`@rtorcato/api-errors-express`](./packages/api-errors-express) | [![npm](https://img.shields.io/npm/v/@rtorcato/api-errors-express.svg)](https://www.npmjs.com/package/@rtorcato/api-errors-express) | Express middleware: `errorHandler` + `notFoundHandler` built on `@rtorcato/api-errors`. |
| [`@rtorcato/api-errors-hono`](./packages/api-errors-hono) | [![npm](https://img.shields.io/npm/v/@rtorcato/api-errors-hono.svg)](https://www.npmjs.com/package/@rtorcato/api-errors-hono) | Hono middleware: `errorHandler` + `notFoundHandler` built on `@rtorcato/api-errors`. |

### Install

```sh
pnpm add @rtorcato/api-errors                       # error classes only
pnpm add @rtorcato/api-errors @rtorcato/api-errors-express express
pnpm add @rtorcato/api-errors @rtorcato/api-errors-hono hono
```

Per-package READMEs (on npm and in each `packages/*/README.md`) carry the usage examples.

### Releases

Versioning + publishing is automated via [Changesets](https://github.com/changesets/changesets). To propose a release:

```sh
pnpm changeset           # describe what changed, pick affected packages + bump type
git commit -am "feat: …"
git push                 # the Release workflow opens a "Version Packages" PR
```

Merging the auto-PR bumps versions, writes per-package `CHANGELOG.md`, and publishes to npm.

## Commands

Run from the repo root.

```sh
pnpm install                              # install workspace deps
pnpm -r build                             # build every package
pnpm -r test                              # test every package
pnpm -r typecheck                         # typecheck every package
pnpm --filter <pkg-name> <script>         # run a script in one package
pnpm check                                # biome lint + format check
pnpm check:fix                            # biome lint + format autofix
```

## Adding a new package

Use the `/new-package` skill so the new package matches existing conventions (tsconfig extends, exports map, vitest config, scripts). Framework deps (Express, Hono) go in `peerDependencies` so consumers control the version.

## Conventions

- Packages must be framework-agnostic where possible. Framework-specific helpers live in their own package (e.g. `api-errors` is generic, `api-errors-express` is the adapter).
- Public API is whatever a package's `exports` field exposes. Internal modules are not part of the contract.
- Conventional commits are enforced by commitlint.

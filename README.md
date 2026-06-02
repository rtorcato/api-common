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

| Package | Description |
| --- | --- |
| [`@rtorcato/api-errors`](./packages/api-errors) | Framework-agnostic HTTP error classes (`HttpError` + 400/401/403/404/409/500 subclasses). |
| [`@rtorcato/api-errors-express`](./packages/api-errors-express) | Express middleware: `errorHandler` + `notFoundHandler` built on `@rtorcato/api-errors`. |
| [`@rtorcato/api-errors-hono`](./packages/api-errors-hono) | Hono middleware: `errorHandler` + `notFoundHandler` built on `@rtorcato/api-errors`. |

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

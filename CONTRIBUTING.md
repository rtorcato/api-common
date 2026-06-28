# Contributing

Thanks for contributing to `api-common`. This is a pnpm + TypeScript monorepo of reusable API library packages.

## Setup

- **Node** >= 22
- **pnpm** (this repo uses pnpm workspaces — don't use npm or yarn)

```bash
pnpm install
```

## Development

Run from the repo root:

```bash
pnpm -r test        # test every package (Vitest)
pnpm -r typecheck   # typecheck every package
pnpm check          # lint + format check (Biome)
pnpm check:fix      # autofix lint/format
pnpm -r build       # build every package
```

Test or typecheck a single package:

```bash
pnpm --filter @rtorcato/api-errors test
```

## Commits

Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/) — commitlint enforces this on commit. Examples:

```
feat(api-errors): add 429 error class
fix(api-errors-express): correct status passthrough
docs: update README
```

A pre-commit hook runs Biome on staged files, so commits are auto-formatted.

## Changesets

Versioning and releases are driven by [changesets](https://github.com/changesets/changesets). **Any change that affects a published package needs a changeset:**

```bash
pnpm changeset
```

Pick the affected package(s) and a bump type (`patch` / `minor` / `major`), describe the change, and commit the generated file in `.changeset/`. Releases publish automatically from `main` once the version PR is merged.

## Pull requests

- Branch off `main`.
- Make sure `pnpm -r test`, `pnpm -r typecheck`, and `pnpm check` pass.
- Include a changeset if you touched a package.
- Keep packages framework-agnostic where possible (see `CLAUDE.md`).

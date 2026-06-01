---
name: new-package
description: Scaffold a new package in this pnpm + TypeScript monorepo. Use when the user asks to "create a new package", "add a package", "scaffold a library", or invokes /new-package. Creates the package directory with package.json (correct exports map, scripts), tsconfig.json (extends root), vitest config, and a starter src/index.ts.
---

# Scaffold a new package

Use this when the user wants to add a new package to the workspace.

## Inputs to gather

Ask the user (in one AskUserQuestion call) for any of these you don't already know:
1. **Package name** — the published name (e.g., `@api-common/express-logger` or `express-logger`). Confirm the scope/prefix matches existing packages in the workspace.
2. **Purpose** — one-line description for package.json.
3. **Target framework** — Express, Hono, framework-agnostic, or other. This determines peerDependencies.

If existing packages are already in the workspace, read one as a reference and **match its conventions** (scope prefix, tsconfig style, exports shape, script names). Do not invent new conventions when an established pattern exists.

## Files to create

Under `packages/<short-name>/` (or wherever existing packages live):

- `package.json` — name, version `0.0.0`, `type: "module"`, `exports` map pointing at built output, scripts: `build`, `test`, `typecheck`. Framework deps go in `peerDependencies`.
- `tsconfig.json` — extends the root tsconfig if one exists, otherwise sane TS strict defaults.
- `vitest.config.ts` — minimal, or omit if the root has a shared config.
- `src/index.ts` — single export placeholder.
- `README.md` — package name + one-line purpose.

## After scaffolding

- Run `pnpm install` from the repo root to wire the new workspace package.
- Run `pnpm --filter <pkg-name> typecheck` to confirm the tsconfig resolves.
- Report what was created and the install/typecheck result.

## Do not

- Add runtime dependencies the user didn't ask for.
- Pull framework code (Express, Hono) into `dependencies` — those belong in `peerDependencies`.
- Invent a different layout than other packages in the workspace.

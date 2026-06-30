# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A monorepo of reusable Node.js library packages for building API projects. Targets Express, Hono, and other Node HTTP frameworks. Each package under the workspace should be independently consumable from a new API project.

## Stack

- **Package manager:** pnpm (workspaces). Use `pnpm` — never `npm` or `yarn`.
- **Language:** TypeScript. Source is `.ts`; packages publish built output.
- **Tests:** Vitest.
- **Lint + format:** Biome (`biome.json` at root). Run `pnpm lint` to check, `pnpm lint:fix` to autofix, `pnpm format` to format only.

## Workspace layout

Packages live in workspace directories (e.g., `packages/<name>`). Each package is independently versioned and publishable. When adding a new package, scaffold it with the `/new-package` skill so it matches existing conventions (tsconfig extends, `exports` map, vitest config, scripts).

## Commands

Run from the repo root unless noted.

- Install: `pnpm install`
- Test everything: `pnpm -r test`
- Test one package: `pnpm --filter <pkg-name> test`
- Typecheck everything: `pnpm -r typecheck`
- Build everything: `pnpm -r build`
- Lint: `pnpm lint` (or `pnpm lint:fix` to autofix)

When verifying changes, prefer the `/verify` skill — it runs typecheck + tests across the workspace and surfaces only failures.

## Conventions

- Packages must be framework-agnostic where possible. If a utility only makes sense for Express, put it in an Express-specific package; don't pull Express into a shared package.
- Public API is whatever a package's `exports` field exposes. Internal modules are not part of the contract.
- New packages: ask before adding runtime dependencies. Prefer peer-deps for framework integrations (Express, Hono) so consumers control the version.
- Before writing a generic utility (env-mode checks, date/uuid/crypto/string helpers, error-message extraction, retries), check the author's public common repos first and depend on the relevant one instead of reinventing — keeps these libs DRY and avoids drift. Primary one to check: `@rtorcato/js-common` (framework-agnostic helpers); also look at the other `@rtorcato/*-common` packages (e.g. `browser-common`, `cf-common`) for domain-specific helpers. Keep HTTP/framework-specific code (status-coded error classes, middleware) here; js-common is for framework-agnostic helpers.

## Module-specific instructions

For per-package guidance (testing quirks, public API rules, etc.), add a `CLAUDE.md` inside that package directory. Claude Code loads it automatically when working in that subtree.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A monorepo of reusable Node.js library packages for building API projects. Targets Express, Hono, and other Node HTTP frameworks. Each package under the workspace should be independently consumable from a new API project.

## Stack

- **Package manager:** pnpm (workspaces). Use `pnpm` — never `npm` or `yarn`.
- **Language:** TypeScript. Source is `.ts`; packages publish built output.
- **Tests:** Vitest.
- **Lint + format:** Biome (`biome.json` at root). Run `pnpm check` to lint + format-check, `pnpm check:fix` to autofix, `pnpm format` to format only.

## Workspace layout

Packages live in workspace directories (e.g., `packages/<name>`). Each package is independently versioned and publishable. When adding a new package, scaffold it with the `/new-package` skill so it matches existing conventions (tsconfig extends, `exports` map, vitest config, scripts).

## Commands

Run from the repo root unless noted.

- Install: `pnpm install`
- Test everything: `pnpm -r test`
- Test one package: `pnpm --filter <pkg-name> test`
- Typecheck everything: `pnpm -r typecheck`
- Build everything: `pnpm -r build`
- Lint: `pnpm check` (or `pnpm check:fix` to autofix)

When verifying changes, prefer the `/verify` skill — it runs typecheck + tests across the workspace and surfaces only failures.

## Conventions

- Packages must be framework-agnostic where possible. If a utility only makes sense for Express, put it in an Express-specific package; don't pull Express into a shared package.
- Public API is whatever a package's `exports` field exposes. Internal modules are not part of the contract.
- New packages: ask before adding runtime dependencies. Prefer peer-deps for framework integrations (Express, Hono) so consumers control the version.
- Before writing a generic utility (env-mode checks, date/uuid/crypto/string helpers, error-message extraction, retries), check the author's public common repos first and depend on the relevant one instead of reinventing — keeps these libs DRY and avoids drift. Primary one to check: `@rtorcato/js-common` (framework-agnostic helpers); also look at the other `@rtorcato/*-common` packages (e.g. `browser-common`, `cf-common`) for domain-specific helpers. Keep HTTP/framework-specific code (status-coded error classes, middleware) here; js-common is for framework-agnostic helpers.

## Releases & publishing

Releases run through Changesets + **npm OIDC trusted publishing** — there is no `NPM_TOKEN`. The `release.yml` workflow needs Node 24, npm ≥ 11.5.1, and pnpm ≥ 10.13 (older pnpm forwards `--no-git-checks` to npm, which now hard-errors). Don't cut a release unless asked.

**Publishing a brand-new package** takes two manual, one-time steps — OIDC can't create a package that doesn't exist yet, and the trusted-publisher config is per-package:

1. First publish it once by hand to create it on npm: `npm login`, then from the package dir `npm publish --access public`.
2. On npmjs.com → the package → **Settings → Trusted Publisher**, add: GitHub Actions, org **`rtorcato`** (exact spelling — a typo → 404 at publish), repo **`api-common`**, workflow **`release.yml`**, allow `npm publish`.

After that, every release publishes it automatically. A missing/misconfigured trusted publisher shows up as an **`E404` on `PUT`** during the release. Existing packages that 404 just need step 2.

## Module-specific instructions

For per-package guidance (testing quirks, public API rules, etc.), add a `CLAUDE.md` inside that package directory. Claude Code loads it automatically when working in that subtree.

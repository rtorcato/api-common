# api-common docs

[Docusaurus](https://docusaurus.io/) site for the [@rtorcato/api-errors](https://www.npmjs.com/package/@rtorcato/api-errors) family (`api-errors`, `api-errors-express`, `api-errors-hono`). Deployed to GitHub Pages at https://rtorcato.github.io/api-common via `.github/workflows/docs.yml`.

## Develop

```bash
# from repo root
pnpm install
pnpm --filter @rtorcato/api-common-docs dev
```

Open http://localhost:3000/api-common/.

## Build locally

```bash
pnpm --filter @rtorcato/api-common-docs build
pnpm --filter @rtorcato/api-common-docs serve
```

## Structure

- `docs/index.md` — landing page
- `docs/guides/` — installation, express, hono
- `docs/api/<pkg>/` — **generated** by one `docusaurus-plugin-typedoc` instance per package from `packages/*/src` (gitignored, rebuilt each run)
- `docs/changelog.md` — **aggregated** from each `packages/*/CHANGELOG.md` by `scripts/aggregate-changelog.mjs` (gitignored, runs as `prebuild`/`predev`/`prestart`)
- `docusaurus.config.ts` — site config, per-package TypeDoc + local-search plugins
- `sidebars.ts` — sidebar layout (Start here / API Reference / Releases)

The API Reference auto-populates from each package's `src/index.ts` — adding an export surfaces it here on the next build. Local full-text search is provided by `@easyops-cn/docusaurus-search-local`.

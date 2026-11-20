// Fail if any @rtorcato/api-common subpath is missing a docs guide. Mirrors
// gen-readme-packages.mjs: packages/api-common/subpaths.json is the source of
// truth for which subpaths must be documented. Until the guides are merged per
// feature, each subpath's guide is still named after the package it replaced
// (guides/api-auth-express.md for `auth/express`). Enforces, per subpath:
//   1. a guide markdown page (or an allowlisted role-named alias)
//   2. that guide is referenced in apps/docs/sidebars.ts
//
// The API Reference (typedoc) pages are derived from the workspace in
// docusaurus.config.ts + sidebars.ts, so they can't drift and aren't checked.
//
//   node scripts/check-docs-coverage.mjs   # exit 1 listing every gap (CI)

import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const subpathsFile = resolve(repoRoot, 'packages/api-common/subpaths.json')
const docsDir = resolve(repoRoot, 'apps/docs')
const guidesDir = resolve(docsDir, 'docs/guides')

// Packages whose guide lives under a role-named page instead of guides/<pkg>.md.
// Keep this map tiny — prefer a per-package guide for anything new.
const GUIDE_ALIAS = {
	'api-errors-express': 'express',
	'api-errors-hono': 'hono',
	'api-testing': 'testing',
}

const shortName = (name) => name.replace('@rtorcato/', '')

const pkgs = JSON.parse(readFileSync(subpathsFile, 'utf8'))
	.map((s) => ({ name: s.formerly, subpath: s.subpath }))
	.sort((a, b) => a.name.localeCompare(b.name))

const sidebars = readFileSync(resolve(docsDir, 'sidebars.ts'), 'utf8')

const problems = []

for (const p of pkgs) {
	const pkg = shortName(p.name)
	const guideSlug = GUIDE_ALIAS[pkg] ?? pkg
	const guideFile = resolve(guidesDir, `${guideSlug}.md`)
	const guideId = `guides/${guideSlug}`

	if (!existsSync(guideFile)) {
		problems.push(`${p.subpath}: missing guide — create apps/docs/docs/${guideId}.md`)
		continue // no point checking the sidebar for a page that doesn't exist
	}
	if (!sidebars.includes(guideId)) {
		problems.push(`${p.subpath}: guide not in sidebar — add '${guideId}' to apps/docs/sidebars.ts`)
	}
}

if (problems.length > 0) {
	console.error(`Docs coverage check failed (${problems.length}):`)
	for (const line of problems) console.error(`  - ${line}`)
	process.exit(1)
}

console.log(`Docs coverage OK — all ${pkgs.length} subpaths have a guide.`)

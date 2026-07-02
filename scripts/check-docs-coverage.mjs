// Fail if any publishable packages/* is missing a docs guide. Mirrors
// gen-readme-packages.mjs: package.json is the source of truth for which
// packages must be documented. Enforces, per package:
//   1. a guide markdown page (or an allowlisted role-named alias)
//   2. that guide is referenced in apps/docs/sidebars.ts
//
// The API Reference (typedoc) pages are derived from the workspace in
// docusaurus.config.ts + sidebars.ts, so they can't drift and aren't checked.
//
//   node scripts/check-docs-coverage.mjs   # exit 1 listing every gap (CI)

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const packagesDir = resolve(repoRoot, 'packages')
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

const pkgs = readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => JSON.parse(readFileSync(resolve(packagesDir, d.name, 'package.json'), 'utf8')))
	.filter((p) => p.name && !p.private)
	.sort((a, b) => a.name.localeCompare(b.name))

const sidebars = readFileSync(resolve(docsDir, 'sidebars.ts'), 'utf8')

const problems = []

for (const p of pkgs) {
	const pkg = shortName(p.name)
	const guideSlug = GUIDE_ALIAS[pkg] ?? pkg
	const guideFile = resolve(guidesDir, `${guideSlug}.md`)
	const guideId = `guides/${guideSlug}`

	if (!existsSync(guideFile)) {
		problems.push(`${pkg}: missing guide — create apps/docs/docs/${guideId}.md`)
		continue // no point checking the sidebar for a page that doesn't exist
	}
	if (!sidebars.includes(guideId)) {
		problems.push(`${pkg}: guide not in sidebar — add '${guideId}' to apps/docs/sidebars.ts`)
	}
}

if (problems.length > 0) {
	console.error(`Docs coverage check failed (${problems.length}):`)
	for (const line of problems) console.error(`  - ${line}`)
	process.exit(1)
}

console.log(`Docs coverage OK — all ${pkgs.length} packages have a guide.`)

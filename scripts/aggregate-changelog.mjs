// Aggregate every packages/*/CHANGELOG.md into apps/docs/docs/changelog.md with
// Docusaurus frontmatter, so changesets keeps owning the per-package changelogs
// while the docs site renders them all on one page. The changelogs of the 37
// packages that @rtorcato/api-common replaced live in apps/docs/legacy-changelogs/
// and follow under a "Before @rtorcato/api-common" section. The output is gitignored —
// regenerated on every docs build (wired as apps/docs's prebuild/predev/prestart).

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '..')
const packagesDir = resolve(repoRoot, 'packages')
const legacyDir = resolve(repoRoot, 'apps/docs/legacy-changelogs')
const target = resolve(repoRoot, 'apps/docs/docs/changelog.md')

const frontmatter = `---
title: Changelog
description: Release notes for the api-common packages, aggregated from each package's CHANGELOG.md.
---

Per-package release notes, managed with [Changesets](https://github.com/changesets/changesets).

`

const pkgs = readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name)
	.sort()

const sections = []
for (const pkg of pkgs) {
	let body
	try {
		body = readFileSync(resolve(packagesDir, pkg, 'CHANGELOG.md'), 'utf8').trim()
	} catch {
		continue // no changelog yet — skip
	}
	// Each package CHANGELOG starts with a `# @rtorcato/<pkg>` H1. Demote every
	// heading one level so the package name becomes a `##` section under the page.
	const demoted = body.replace(/^(#{1,5}) /gm, '#$1 ')
	sections.push(demoted)
}

const legacy = readdirSync(legacyDir)
	.filter((f) => f.endsWith('.md'))
	.sort()
	.map((f) =>
		readFileSync(resolve(legacyDir, f), 'utf8')
			.trim()
			.replace(/^(#{1,4}) /gm, '##$1 ')
	)
if (legacy.length > 0) {
	sections.push(
		`## Before @rtorcato/api-common\n\nThese packages were merged into \`@rtorcato/api-common\` and get no further releases.\n\n${legacy.join('\n\n---\n\n')}`
	)
}

const content =
	sections.length > 0
		? `${frontmatter + sections.join('\n\n---\n\n')}\n`
		: `${frontmatter}No releases recorded yet.\n`

writeFileSync(target, content)
console.log(`aggregate-changelog: wrote ${target} (${sections.length} package(s))`)

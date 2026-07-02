import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Short names (without the @rtorcato/ scope) of every publishable workspace
// package, sorted. Single source of truth for the typedoc instances and the
// API Reference sidebar, so neither can drift when a package is added.
// ponytail: resolves packages/ from cwd (= apps/docs); the docs pipeline only
// ever runs via `pnpm --filter @rtorcato/api-common-docs`.
const packagesDir = resolve(process.cwd(), '../../packages')

export const publishablePackages: string[] = readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => JSON.parse(readFileSync(resolve(packagesDir, d.name, 'package.json'), 'utf8')))
	.filter((p) => p.name && !p.private)
	.map((p) => p.name.replace('@rtorcato/', ''))
	.sort()

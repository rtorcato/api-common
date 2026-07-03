import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Short names (without the @rtorcato/ scope) of every publishable workspace
// package, sorted. Single source of truth for the typedoc instances and the
// API Reference sidebar, so neither can drift when a package is added.
// ponytail: resolves packages/ from cwd (= apps/docs); the docs pipeline only
// ever runs via `pnpm --filter @rtorcato/api-common-docs`.
const packagesDir = resolve(process.cwd(), '../../packages')

const manifests = readdirSync(packagesDir, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => JSON.parse(readFileSync(resolve(packagesDir, d.name, 'package.json'), 'utf8')))
	.filter((p) => p.name && !p.private)

export const publishablePackages: string[] = manifests
	.map((p) => p.name.replace('@rtorcato/', ''))
	.sort()

// Short name -> package.json description, so the API Reference index cards can
// show what each package does instead of TypeDoc's generic "Interfaces"/"Classes"
// fallback. Single source of truth = the package's own manifest.
export const packageDescriptions: Record<string, string> = Object.fromEntries(
	manifests.map((p) => [p.name.replace('@rtorcato/', ''), (p.description ?? '') as string])
)

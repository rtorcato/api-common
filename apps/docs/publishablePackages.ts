import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Every subpath export of @rtorcato/api-common, sorted. Single source of truth
// for the typedoc instances and the API Reference sidebar, so neither can drift
// when a subpath is added. Read from packages/api-common/subpaths.json, which
// a package test keeps in step with the `exports` map.
// ponytail: resolves packages/ from cwd (= apps/docs); the docs pipeline only
// ever runs via `pnpm --filter @rtorcato/api-common-docs`.
interface SubpathEntry {
	subpath: string
	formerly: string
	description: string
}

const subpaths: SubpathEntry[] = JSON.parse(
	readFileSync(resolve(process.cwd(), '../../packages/api-common/subpaths.json'), 'utf8')
)

// Doc-id-safe slug for a subpath: `auth/express` -> `auth-express`.
const slugOf = (subpath: string) => subpath.replace(/\//g, '-')

export const publishablePackages: string[] = subpaths.map((s) => slugOf(s.subpath)).sort()

// Slug -> subpath, for the typedoc entry point and the sidebar label.
export const packageSubpaths: Record<string, string> = Object.fromEntries(
	subpaths.map((s) => [slugOf(s.subpath), s.subpath])
)

// Slug -> description, so the API Reference index cards show what each subpath
// does instead of TypeDoc's generic "Interfaces"/"Classes" fallback.
export const packageDescriptions: Record<string, string> = Object.fromEntries(
	subpaths.map((s) => [slugOf(s.subpath), s.description])
)

// Size budgets for every published package, one per `exports` subpath
// (derived from each package.json, so new packages/subpaths are covered
// automatically). Run `pnpm build` first, then `pnpm size`.
//
// Measured: own code + runtime `dependencies` (that is the bloat we want to
// catch). Peer deps (express, hono, ...) and node builtins are external —
// the consumer already pays for those.
const { readdirSync, readFileSync, existsSync } = require('node:fs')
const { builtinModules } = require('node:module')

// ~25% above measured size (minified + brotli), measured 2026-10.
// Most packages are well under 800 B; the outliers below bundle real deps.
const DEFAULT_LIMIT = '1 kB'
// Keyed by `<package dir>` or `<package dir>/<subpath>`.
const OVERRIDES = {
	'api-auth': '18.5 kB',
	'api-auth-express': '18.6 kB',
	'api-auth-hono': '18.6 kB',
	'api-config': '3.7 kB',
	'api-cors-express': '2.6 kB',
	'api-errors-express': '20.5 kB',
	'api-errors-hono': '20.4 kB',
	'api-logger': '23.4 kB',
	'api-openapi': '1.3 kB',
	'api-security-express': '3.6 kB',
	'api-testing': '42.4 kB',
	'api-validation': '2.3 kB',
}

const builtins = builtinModules.flatMap((m) => [m, `node:${m}`])

module.exports = readdirSync('packages').flatMap((dir) => {
	const pkgPath = `packages/${dir}/package.json`
	if (!existsSync(pkgPath)) return []
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
	if (pkg.private) return []
	const ignore = [...builtins, ...Object.keys(pkg.peerDependencies ?? {})]
	return Object.entries(pkg.exports ?? {}).map(([subpath, target]) => {
		const key = subpath === '.' ? dir : `${dir}/${subpath.slice(2)}`
		return {
			name: key,
			path: `packages/${dir}/${(target.import ?? target.default ?? target).replace(/^\.\//, '')}`,
			limit: OVERRIDES[key] ?? DEFAULT_LIMIT,
			ignore,
		}
	})
})

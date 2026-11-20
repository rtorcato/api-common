// Size budgets for every published package, one per `exports` subpath
// (derived from each package.json, so new packages/subpaths are covered
// automatically). Run `pnpm build` first, then `pnpm size`.
//
// Measured: own code + runtime `dependencies` (that is the bloat we want to
// catch). Peer deps (express, hono, ...) and node builtins are external —
// the consumer already pays for those.
const { readdirSync, readFileSync, existsSync } = require('node:fs')
const { builtinModules } = require('node:module')

// ~25% above measured size (minified + brotli). Every subpath measured under
// 800 B on 2026-11-20 except openapi. Third-party libraries are optional peers,
// so only own code and @rtorcato/js-common count.
const DEFAULT_LIMIT = '1 kB'
// Keyed by `<package dir>` or `<package dir>/<subpath>`.
const OVERRIDES = {
	'api-common/openapi': '1.3 kB',
}

const builtins = builtinModules.flatMap((m) => [m, `node:${m}`])

module.exports = readdirSync('packages').flatMap((dir) => {
	const pkgPath = `packages/${dir}/package.json`
	if (!existsSync(pkgPath)) return []
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
	if (pkg.private) return []
	const ignore = [...builtins, ...Object.keys(pkg.peerDependencies ?? {})]
	// `./package.json` and other non-code entries have nothing to measure.
	const entries = Object.entries(pkg.exports ?? {}).filter(
		([subpath]) => subpath !== './package.json'
	)
	return entries.map(([subpath, target]) => {
		const key = subpath === '.' ? dir : `${dir}/${subpath.slice(2)}`
		return {
			name: key,
			path: `packages/${dir}/${(target.import ?? target.default ?? target).replace(/^\.\//, '')}`,
			limit: OVERRIDES[key] ?? DEFAULT_LIMIT,
			ignore,
		}
	})
})

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

// Guards the single-package layout: subpaths.json (which drives the README and
// docs), the `exports` map and the src/ folders must list the same subpaths, and
// only adapter folders may load a framework.
const pkgDir = join(import.meta.dirname, '..')
const srcDir = join(pkgDir, 'src')
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const subpaths: { subpath: string }[] = JSON.parse(
	readFileSync(join(pkgDir, 'subpaths.json'), 'utf8')
)

const exported = Object.keys(pkg.exports)
	.filter((key) => key !== './package.json')
	.map((key) => key.slice(2))
	.sort()

const walk = (dir: string): string[] =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)]
	)

describe('@rtorcato/api-common layout', () => {
	it('has no root export', () => {
		expect(pkg.exports['.']).toBeUndefined()
	})

	it('lists the same subpaths in subpaths.json and the exports map', () => {
		expect(subpaths.map((s) => s.subpath).sort()).toEqual(exported)
	})

	it('has a src/<subpath>/index.ts for every export', () => {
		const missing = exported.filter((s) => !existsSync(join(srcDir, s, 'index.ts')))
		expect(missing).toEqual([])
	})

	it('maps every export to dist/<subpath>/index', () => {
		for (const s of exported) {
			expect(pkg.exports[`./${s}`]).toEqual({
				types: `./dist/${s}/index.d.ts`,
				import: `./dist/${s}/index.js`,
			})
		}
	})

	it('marks every peer dependency optional', () => {
		const peers = Object.keys(pkg.peerDependencies).sort()
		const optional = Object.entries(pkg.peerDependenciesMeta)
			.filter(([, meta]) => (meta as { optional?: boolean }).optional)
			.map(([name]) => name)
			.sort()
		expect(optional).toEqual(peers)
	})

	it('imports express or hono only from adapter folders and express-utils', () => {
		const framework = /from ['"](express|hono)(\/[^'"]*)?['"]/
		const offenders = walk(srcDir)
			.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
			.map((file) => relative(srcDir, file).split(sep).join('/'))
			.filter((file) => !/(^|\/)(express|hono)\//.test(file) && !file.startsWith('express-utils/'))
			.filter((file) => framework.test(readFileSync(join(srcDir, file), 'utf8')))
		expect(offenders).toEqual([])
	})

	it('never imports an adapter folder from a core folder', () => {
		const adapterImport = /from ['"][^'"]*\/(express|hono)\/index\.js['"]/
		const offenders = walk(srcDir)
			.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts'))
			.map((file) => relative(srcDir, file).split(sep).join('/'))
			.filter((file) => !/(^|\/)(express|hono)\//.test(file))
			.filter((file) => adapterImport.test(readFileSync(join(srcDir, file), 'utf8')))
		expect(offenders).toEqual([])
	})
})

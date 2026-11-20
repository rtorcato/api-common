import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// Imports every subpath from the built dist/ under plain Node ESM, in a child
// process. Vitest's own resolver forgives extensionless relative imports, so a
// test that imported through it would pass on a build Node can't load (#327).
const pkgDir = join(import.meta.dirname, '..')
const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
const subpaths = Object.keys(pkg.exports)
	.filter((key) => key !== './package.json')
	.map((key) => key.slice(2))

const built = existsSync(join(pkgDir, 'dist'))

// CI always builds before testing, so a missing dist/ there is a failure, not a skip.
describe.skipIf(!built && !process.env.CI)('built ESM output', () => {
	it('loads every subpath under plain Node', () => {
		const script = `
			const failures = []
			for (const subpath of ${JSON.stringify(subpaths)}) {
				try {
					await import('${pkg.name}/' + subpath)
				} catch (error) {
					failures.push(subpath + ': ' + (error.code ?? '') + ' ' + error.message.split('\\n')[0])
				}
			}
			process.stdout.write(JSON.stringify(failures))
		`
		const out = execFileSync(process.execPath, ['--input-type=module', '-e', script], {
			cwd: pkgDir,
			encoding: 'utf8',
		})
		expect(JSON.parse(out)).toEqual([])
	})
})

import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { loadEnv } from './index'

describe('loadEnv', () => {
	it('parses and coerces process.env', () => {
		process.env['MY_TEST_PORT'] = '8080'
		const env = loadEnv(z.object({ MY_TEST_PORT: z.coerce.number() }), { skipDotenv: true })
		expect(env.MY_TEST_PORT).toBe(8080)
	})

	it('throws on missing required vars', () => {
		expect(() =>
			loadEnv(z.object({ DEFINITELY_MISSING_VAR: z.string() }), { skipDotenv: true })
		).toThrow(/Invalid environment variables/)
	})
})

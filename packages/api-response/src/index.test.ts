import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { ok, successSchema } from './index'

describe('ok', () => {
	it('wraps data in a success envelope', () => {
		expect(ok({ id: 1 })).toEqual({ success: true, data: { id: 1 } })
	})

	it('omits message when not provided', () => {
		expect('message' in ok('x')).toBe(false)
	})

	it('includes message when provided', () => {
		expect(ok('x', 'done')).toEqual({ success: true, data: 'x', message: 'done' })
	})
})

describe('successSchema', () => {
	it('validates a well-formed envelope', () => {
		const schema = successSchema(z.object({ id: z.number() }))
		expect(schema.parse({ success: true, data: { id: 1 } })).toEqual({
			success: true,
			data: { id: 1 },
		})
	})

	it('rejects a wrong data shape', () => {
		const schema = successSchema(z.object({ id: z.number() }))
		expect(schema.safeParse({ success: true, data: { id: 'no' } }).success).toBe(false)
	})
})

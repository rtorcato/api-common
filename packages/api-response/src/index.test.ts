import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { errorSchema, ok, successSchema } from './index'

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

describe('errorSchema', () => {
	it('validates a well-formed error envelope', () => {
		const schema = errorSchema()
		expect(
			schema.parse({ error: 'NotFoundError', code: 'not_found', message: 'Not found' })
		).toEqual({ error: 'NotFoundError', code: 'not_found', message: 'Not found' })
	})

	it('allows an optional stack field', () => {
		const schema = errorSchema()
		const result = schema.parse({ error: 'E', code: 'e', message: 'm', stack: 'at ...' })
		expect(result.stack).toBe('at ...')
	})

	it('rejects a missing required field', () => {
		expect(errorSchema().safeParse({ error: 'E', code: 'e' }).success).toBe(false)
	})
})

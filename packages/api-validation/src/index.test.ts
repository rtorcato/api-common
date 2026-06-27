import { BadRequestError } from '@rtorcato/api-errors'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { formatZodError, validate } from './index'

const schema = z.object({ name: z.string(), age: z.number() })

describe('validate', () => {
	it('returns typed data on success', () => {
		expect(validate(schema, { name: 'a', age: 1 })).toEqual({ name: 'a', age: 1 })
	})

	it('throws BadRequestError on failure', () => {
		expect(() => validate(schema, { name: 'a' })).toThrow(BadRequestError)
	})
})

describe('formatZodError', () => {
	it('formats issues into a numbered string', () => {
		const result = schema.safeParse({})
		expect(result.success).toBe(false)
		if (!result.success) {
			expect(formatZodError(result.error)).toContain('Error #1')
		}
	})
})

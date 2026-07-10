import { ServiceUnavailableError } from '@rtorcato/api-errors'
import { describe, expect, it } from 'vitest'
import { withTimeout } from './index'

describe('withTimeout', () => {
	it('resolves when the promise settles before the deadline', async () => {
		await expect(withTimeout(Promise.resolve('ok'), 1000)).resolves.toBe('ok')
	})

	it('passes through the promise rejection when it settles first', async () => {
		await expect(withTimeout(Promise.reject(new Error('boom')), 1000)).rejects.toThrow('boom')
	})

	it('rejects with ServiceUnavailableError after the deadline', async () => {
		const never = new Promise<never>(() => {})
		await expect(withTimeout(never, 10)).rejects.toBeInstanceOf(ServiceUnavailableError)
	})

	it('rejects with a 503 status on timeout', async () => {
		const never = new Promise<never>(() => {})
		await expect(withTimeout(never, 10)).rejects.toMatchObject({ status: 503 })
	})
})

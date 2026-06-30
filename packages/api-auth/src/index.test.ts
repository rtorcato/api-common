import { describe, it, expect } from 'vitest'
import { signToken, verifyToken, findToken, findRefreshToken } from './index'
import { UnauthorizedError } from '@rtorcato/api-errors'

const SECRET = 'test-secret'

describe('signToken / verifyToken', () => {
	it('round-trips a payload', () => {
		const token = signToken({ userId: 1 }, SECRET)
		const payload = verifyToken<{ userId: number }>(token, SECRET)
		expect(payload.userId).toBe(1)
	})

	it('throws UnauthorizedError on bad token', () => {
		expect(() => verifyToken('bad.token.here', SECRET)).toThrow(UnauthorizedError)
	})

	it('throws UnauthorizedError on wrong secret', () => {
		const token = signToken({ userId: 1 }, SECRET)
		expect(() => verifyToken(token, 'wrong-secret')).toThrow(UnauthorizedError)
	})

	it('respects expiresIn option', async () => {
		const token = signToken({ userId: 1 }, SECRET, { expiresIn: '1ms' })
		await new Promise((r) => setTimeout(r, 5))
		expect(() => verifyToken(token, SECRET)).toThrow(UnauthorizedError)
	})
})

describe('findToken', () => {
	it('extracts from Authorization Bearer header', () => {
		const req = { headers: { authorization: 'Bearer abc123' } }
		expect(findToken(req)).toBe('abc123')
	})

	it('falls back to cookie', () => {
		const req = { headers: {}, cookies: { token: 'cookieToken' } }
		expect(findToken(req)).toBe('cookieToken')
	})

	it('uses custom cookie name', () => {
		const req = { headers: {}, cookies: { myToken: 'val' } }
		expect(findToken(req, { cookieName: 'myToken' })).toBe('val')
	})

	it('returns undefined when nothing found', () => {
		expect(findToken({ headers: {} })).toBeUndefined()
	})

	it('prefers header over cookie', () => {
		const req = { headers: { authorization: 'Bearer header' }, cookies: { token: 'cookie' } }
		expect(findToken(req)).toBe('header')
	})
})

describe('findRefreshToken', () => {
	it('extracts from default cookie name', () => {
		const req = { cookies: { refreshToken: 'rt123' } }
		expect(findRefreshToken(req)).toBe('rt123')
	})

	it('uses custom cookie name', () => {
		const req = { cookies: { myRefresh: 'rt456' } }
		expect(findRefreshToken(req, { cookieName: 'myRefresh' })).toBe('rt456')
	})

	it('returns undefined when cookie absent', () => {
		expect(findRefreshToken({})).toBeUndefined()
	})
})

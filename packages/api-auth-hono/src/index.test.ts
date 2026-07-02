import { signToken } from '@rtorcato/api-auth'
import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { type AuthVariables, authMiddleware, optionalAuthMiddleware } from './index'

const SECRET = 'test-secret'

function buildApp(middleware: ReturnType<typeof authMiddleware>) {
	const app = new Hono<{ Variables: AuthVariables }>()
	app.use(middleware)
	app.get('/', (c) => c.json({ user: c.get('user') }))
	app.onError((err, c) => {
		const e = err as { status?: number; code?: string }
		return c.json({ code: e.code }, (e.status ?? 500) as 500)
	})
	return app
}

describe('authMiddleware', () => {
	it('sets c.get(user) for a valid Bearer token', async () => {
		const token = signToken({ userId: 42 }, SECRET)
		const res = await buildApp(authMiddleware(SECRET)).request('/', {
			headers: { Authorization: `Bearer ${token}` },
		})
		expect(res.status).toBe(200)
		expect(((await res.json()) as any).user.userId).toBe(42)
	})

	it('reads the token from a cookie', async () => {
		const token = signToken({ userId: 5 }, SECRET)
		const res = await buildApp(authMiddleware(SECRET)).request('/', {
			headers: { Cookie: `token=${token}` },
		})
		expect(res.status).toBe(200)
		expect(((await res.json()) as any).user.userId).toBe(5)
	})

	it('returns 401 when no token is provided', async () => {
		const res = await buildApp(authMiddleware(SECRET)).request('/')
		expect(res.status).toBe(401)
		expect(((await res.json()) as any).code).toBe('missing_token')
	})

	it('returns 401 for an invalid token', async () => {
		const res = await buildApp(authMiddleware(SECRET)).request('/', {
			headers: { Authorization: 'Bearer bad.token.here' },
		})
		expect(res.status).toBe(401)
		expect(((await res.json()) as any).code).toBe('invalid_token')
	})

	it('returns 401 for a token signed with the wrong secret', async () => {
		const token = signToken({ userId: 1 }, 'other-secret')
		const res = await buildApp(authMiddleware(SECRET)).request('/', {
			headers: { Authorization: `Bearer ${token}` },
		})
		expect(res.status).toBe(401)
		expect(((await res.json()) as any).code).toBe('invalid_token')
	})
})

describe('optionalAuthMiddleware', () => {
	it('sets c.get(user) when a valid token is present', async () => {
		const token = signToken({ userId: 7 }, SECRET)
		const res = await buildApp(optionalAuthMiddleware(SECRET)).request('/', {
			headers: { Authorization: `Bearer ${token}` },
		})
		expect(res.status).toBe(200)
		expect(((await res.json()) as any).user.userId).toBe(7)
	})

	it('passes through when no token is present', async () => {
		const res = await buildApp(optionalAuthMiddleware(SECRET)).request('/')
		expect(res.status).toBe(200)
		expect(((await res.json()) as any).user).toBeUndefined()
	})

	it('passes through when the token is invalid', async () => {
		const res = await buildApp(optionalAuthMiddleware(SECRET)).request('/', {
			headers: { Authorization: 'Bearer bad.token' },
		})
		expect(res.status).toBe(200)
		expect(((await res.json()) as any).user).toBeUndefined()
	})
})

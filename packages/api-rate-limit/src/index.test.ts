import { describe, expect, it, vi } from 'vitest'
import { createRateLimiter, memoryStore } from './index'

const make = (opts: { requests: number; windowMs: number }) =>
	createRateLimiter({ ...opts, store: memoryStore() })

describe('createRateLimiter', () => {
	it('allows up to the limit then blocks', async () => {
		const rl = make({ requests: 2, windowMs: 1000 })
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(false)
	})

	it('tracks keys independently', async () => {
		const rl = make({ requests: 1, windowMs: 1000 })
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('b')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(false)
	})

	it('reports remaining requests', async () => {
		const rl = make({ requests: 3, windowMs: 1000 })
		expect((await rl.check('a')).remaining).toBe(2)
		expect((await rl.check('a')).remaining).toBe(1)
	})

	it('allows again after the window slides past', async () => {
		vi.useFakeTimers()
		try {
			const rl = make({ requests: 1, windowMs: 1000 })
			expect((await rl.check('a')).allowed).toBe(true)
			expect((await rl.check('a')).allowed).toBe(false)
			vi.advanceTimersByTime(1001)
			expect((await rl.check('a')).allowed).toBe(true)
		} finally {
			vi.useRealTimers()
		}
	})

	it('reset clears tracked keys', async () => {
		const rl = make({ requests: 1, windowMs: 1000 })
		expect((await rl.check('a')).allowed).toBe(true)
		await rl.reset()
		expect((await rl.check('a')).allowed).toBe(true)
	})

	it('shares one store across limiters with different windows', async () => {
		const store = memoryStore()
		const fast = createRateLimiter({ requests: 1, windowMs: 1000, store })
		const slow = createRateLimiter({ requests: 5, windowMs: 10_000, store })
		// Same store instance, independent windows/limits per limiter.
		expect((await fast.check('a')).allowed).toBe(true)
		expect((await slow.check('b')).allowed).toBe(true)
	})
})

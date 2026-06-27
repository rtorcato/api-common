import { describe, expect, it, vi } from 'vitest'
import { createRateLimiter } from './index'

describe('createRateLimiter', () => {
	it('allows up to the limit then blocks', () => {
		const rl = createRateLimiter({ requests: 2, windowMs: 1000 })
		expect(rl.check('a').allowed).toBe(true)
		expect(rl.check('a').allowed).toBe(true)
		expect(rl.check('a').allowed).toBe(false)
	})

	it('tracks keys independently', () => {
		const rl = createRateLimiter({ requests: 1, windowMs: 1000 })
		expect(rl.check('a').allowed).toBe(true)
		expect(rl.check('b').allowed).toBe(true)
		expect(rl.check('a').allowed).toBe(false)
	})

	it('reports remaining requests', () => {
		const rl = createRateLimiter({ requests: 3, windowMs: 1000 })
		expect(rl.check('a').remaining).toBe(2)
		expect(rl.check('a').remaining).toBe(1)
	})

	it('allows again after the window slides past', () => {
		vi.useFakeTimers()
		try {
			const rl = createRateLimiter({ requests: 1, windowMs: 1000 })
			expect(rl.check('a').allowed).toBe(true)
			expect(rl.check('a').allowed).toBe(false)
			vi.advanceTimersByTime(1001)
			expect(rl.check('a').allowed).toBe(true)
		} finally {
			vi.useRealTimers()
		}
	})

	it('reset clears tracked keys', () => {
		const rl = createRateLimiter({ requests: 1, windowMs: 1000 })
		expect(rl.check('a').allowed).toBe(true)
		rl.reset()
		expect(rl.check('a').allowed).toBe(true)
	})
})

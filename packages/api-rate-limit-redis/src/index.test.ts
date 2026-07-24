import { createRateLimiter } from '@rtorcato/api-rate-limit'
import { describe, expect, it, vi } from 'vitest'
import { type RedisRateLimitClient, redisStore } from './index'

/**
 * In-memory stand-in for ioredis that reproduces the semantics our Lua script
 * relies on (sorted set per key: drop-expired, count, conditional add). Lets us
 * exercise redisStore's contract without a live Redis. The real Lua is verified
 * against an actual Redis; this covers arg marshaling, result mapping, and reset.
 */
function fakeRedis(): RedisRateLimitClient {
	const store = new Map<string, Map<string, number>>()
	return {
		eval(_script, _numkeys, ...args) {
			const key = String(args[0])
			const now = Number(args[1])
			const cutoff = Number(args[2])
			const limit = Number(args[3])
			const member = String(args[5])
			const set = store.get(key) ?? new Map<string, number>()
			for (const [m, score] of set) if (score <= cutoff) set.delete(m)
			if (set.size >= limit) return Promise.resolve([0, 0])
			set.set(member, now)
			store.set(key, set)
			return Promise.resolve([1, limit - set.size])
		},
		scan(_cursor, ..._args) {
			// Single page: MATCH is the 2nd arg, pattern the 3rd (`ratelimit:*`).
			const pattern = String(_args[1] ?? '*').replace('*', '')
			const keys = [...store.keys()].filter((k) => k.startsWith(pattern))
			return Promise.resolve(['0', keys])
		},
		del(...keys) {
			let n = 0
			for (const k of keys) if (store.delete(k)) n++
			return Promise.resolve(n)
		},
	}
}

const make = (opts: { requests: number; windowMs: number }, client = fakeRedis()) =>
	createRateLimiter({ ...opts, store: redisStore(client) })

describe('redisStore', () => {
	it('allows up to the limit then blocks', async () => {
		const rl = make({ requests: 2, windowMs: 1000 })
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(false)
	})

	it('reports remaining requests', async () => {
		const rl = make({ requests: 3, windowMs: 1000 })
		expect((await rl.check('a')).remaining).toBe(2)
		expect((await rl.check('a')).remaining).toBe(1)
	})

	it('records unique members for same-millisecond hits', async () => {
		const client = fakeRedis()
		const spy = vi.spyOn(client, 'eval')
		const rl = createRateLimiter({ requests: 5, windowMs: 1000, store: redisStore(client) })
		await rl.check('a')
		await rl.check('a')
		const member1 = spy.mock.calls[0]?.at(-1)
		const member2 = spy.mock.calls[1]?.at(-1)
		expect(member1).not.toBe(member2)
	})

	it('namespaces keys with the prefix', async () => {
		const client = fakeRedis()
		const spy = vi.spyOn(client, 'eval')
		const store = redisStore(client, { prefix: 'rl:test:' })
		await createRateLimiter({ requests: 1, windowMs: 1000, store }).check('a')
		expect(spy.mock.calls[0]?.[2]).toBe('rl:test:a')
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

	it('reset drops tracked keys under the prefix', async () => {
		const client = fakeRedis()
		const store = redisStore(client)
		const rl = createRateLimiter({ requests: 1, windowMs: 1000, store })
		expect((await rl.check('a')).allowed).toBe(true)
		expect((await rl.check('a')).allowed).toBe(false)
		await rl.reset()
		expect((await rl.check('a')).allowed).toBe(true)
	})
})

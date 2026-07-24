import type { RateLimitStore } from '@rtorcato/api-rate-limit'

/**
 * Minimal structural view of the Redis client methods this store calls.
 * Matches `ioredis` (positional `eval`/`scan`) — pass an `ioredis` instance
 * directly. Typed structurally so this package doesn't depend on ioredis types.
 */
export interface RedisRateLimitClient {
	eval(script: string, numkeys: number, ...args: (string | number)[]): Promise<unknown>
	scan(cursor: string | number, ...args: (string | number)[]): Promise<[string, string[]]>
	del(...keys: string[]): Promise<number>
}

export interface RedisStoreOptions {
	/** Key prefix so limiter keys don't collide with other Redis data. */
	prefix?: string
}

// Atomic sliding-window (log) via a sorted set keyed by timestamp:
//   1. drop entries older than the window
//   2. count what's left
//   3. if at/over the limit -> blocked (don't record the hit)
//   4. else record this hit, refresh TTL, return remaining
// One round-trip, no read-modify-write race across instances.
// KEYS[1]=key  ARGV: now, cutoff, limit, windowMs, member
const HIT_SCRIPT = `
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[2])
local count = redis.call('ZCARD', KEYS[1])
if count >= tonumber(ARGV[3]) then
  return {0, 0}
end
redis.call('ZADD', KEYS[1], ARGV[1], ARGV[5])
redis.call('PEXPIRE', KEYS[1], tonumber(ARGV[4]))
return {1, tonumber(ARGV[3]) - count - 1}
`

/**
 * Redis-backed sliding-window store — counts are shared across every instance
 * pointing at the same Redis, so the configured limit holds no matter how many
 * replicas run.
 *
 * ```ts
 * import Redis from 'ioredis'
 * const store = redisStore(new Redis(process.env.REDIS_URL))
 * const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store })
 * ```
 */
export function redisStore(
	client: RedisRateLimitClient,
	{ prefix = 'ratelimit:' }: RedisStoreOptions = {}
): RateLimitStore {
	// Unique member per hit so simultaneous hits in the same millisecond don't
	// collide in the sorted set (ZADD is keyed by member, not score).
	let seq = 0

	return {
		async hit(key, { windowMs, limit }) {
			const now = Date.now()
			const cutoff = now - windowMs
			const member = `${now}-${seq++}`
			const [allowed, remaining] = (await client.eval(
				HIT_SCRIPT,
				1,
				`${prefix}${key}`,
				String(now),
				String(cutoff),
				String(limit),
				String(windowMs),
				member
			)) as [number, number]
			return { allowed: allowed === 1, remaining }
		},

		// Drops every key under `prefix`. Uses SCAN (non-blocking) not KEYS.
		// ponytail: fine for tests/manual resets; don't call on a hot path, and
		// keep `prefix` isolated so it can't sweep unrelated data.
		async reset() {
			let cursor = '0'
			do {
				const [next, keys] = await client.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 100)
				if (keys.length > 0) await client.del(...keys)
				cursor = next
			} while (cursor !== '0')
		},
	}
}

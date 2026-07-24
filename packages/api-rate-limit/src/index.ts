export interface RateLimiterOptions {
	/** Max requests allowed per key within the window. */
	requests: number
	/** Sliding window size in milliseconds. */
	windowMs: number
	/**
	 * Where hit counts live. Required — there is no default, because a silent
	 * in-memory default is wrong across multiple instances (each process holds
	 * its own counts, so the real limit becomes N× the configured value).
	 * Use `memoryStore()` for single-process/dev/tests, or `redisStore()` from
	 * `@rtorcato/api-rate-limit-redis` for limits shared across instances.
	 */
	store: RateLimitStore
}

export interface RateLimitResult {
	allowed: boolean
	/** Requests remaining in the current window (0 when blocked). */
	remaining: number
}

export interface RateLimitStore {
	/**
	 * Record a hit for `key` and report whether it is within the limit.
	 *
	 * The window/limit are passed per call (not bound at construction) so one
	 * store instance — e.g. a shared Redis connection — can back many limiters
	 * with different windows.
	 */
	hit: (key: string, opts: { windowMs: number; limit: number }) => Promise<RateLimitResult>
	/** Drop all tracked keys (handy for tests and manual resets). */
	reset: () => Promise<void>
}

export interface RateLimiter {
	/** Record a hit for `key` and report whether it is within the limit. */
	check: (key: string) => Promise<RateLimitResult>
	/** Drop all tracked keys (handy for tests and manual resets). */
	reset: () => Promise<void>
}

// Sweep stale keys every N hits so the Map can't grow unbounded from one-off
// keys that are never seen again (the bug in the original middleware).
const SWEEP_INTERVAL = 1000

/**
 * In-memory sliding-window (log) store. Single-process only — counts live in
 * this process's `Map`, so behind N replicas the effective limit is N× the
 * configured value. Good for local dev, tests, and single-instance apps; reach
 * for `redisStore()` when limits must hold across instances.
 */
export function memoryStore(): RateLimitStore {
	const hits = new Map<string, number[]>()
	let opsSinceSweep = 0

	function sweep(cutoff: number): void {
		if (++opsSinceSweep < SWEEP_INTERVAL) return
		opsSinceSweep = 0
		for (const [key, timestamps] of hits) {
			const live = timestamps.filter((t) => t > cutoff)
			if (live.length === 0) hits.delete(key)
			else hits.set(key, live)
		}
	}

	return {
		hit(key, { windowMs, limit }) {
			const now = Date.now()
			const cutoff = now - windowMs
			sweep(cutoff)

			const recent = (hits.get(key) ?? []).filter((t) => t > cutoff)

			if (recent.length >= limit) {
				hits.set(key, recent)
				return Promise.resolve({ allowed: false, remaining: 0 })
			}

			recent.push(now)
			hits.set(key, recent)
			return Promise.resolve({ allowed: true, remaining: limit - recent.length })
		},
		reset() {
			hits.clear()
			opsSinceSweep = 0
			return Promise.resolve()
		},
	}
}

/**
 * Create a sliding-window rate limiter over a pluggable store.
 *
 * Framework-agnostic — `await check(key)` from any handler and react to the
 * result. Wrap it for Hono/Express in a dedicated adapter package.
 *
 * ```ts
 * const limiter = createRateLimiter({ requests: 100, windowMs: 60_000, store: memoryStore() })
 * const { allowed, remaining } = await limiter.check(ip)
 * ```
 */
export function createRateLimiter({ requests, windowMs, store }: RateLimiterOptions): RateLimiter {
	return {
		check: (key) => store.hit(key, { windowMs, limit: requests }),
		reset: () => store.reset(),
	}
}

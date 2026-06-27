export interface RateLimiterOptions {
	/** Max requests allowed per key within the window. */
	requests: number
	/** Sliding window size in milliseconds. */
	windowMs: number
}

export interface RateLimitResult {
	allowed: boolean
	/** Requests remaining in the current window (0 when blocked). */
	remaining: number
}

export interface RateLimiter {
	/** Record a hit for `key` and report whether it is within the limit. */
	check: (key: string) => RateLimitResult
	/** Drop all tracked keys (handy for tests and manual resets). */
	reset: () => void
}

// Sweep stale keys every N checks so the Map can't grow unbounded from one-off
// keys that are never seen again (the bug in the original middleware).
const SWEEP_INTERVAL = 1000

/**
 * Create an in-memory sliding-window rate limiter.
 *
 * Framework-agnostic — call `check(key)` from any handler and react to the
 * result. Wrap it for Hono/Express in a dedicated adapter package.
 *
 * ponytail: in-memory, single-process only. Swap the Map for a shared store
 * (e.g. Redis) behind the same interface if you need limits across instances.
 */
export function createRateLimiter({ requests, windowMs }: RateLimiterOptions): RateLimiter {
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
		check(key) {
			const now = Date.now()
			const cutoff = now - windowMs
			sweep(cutoff)

			const recent = (hits.get(key) ?? []).filter((t) => t > cutoff)

			if (recent.length >= requests) {
				hits.set(key, recent)
				return { allowed: false, remaining: 0 }
			}

			recent.push(now)
			hits.set(key, recent)
			return { allowed: true, remaining: requests - recent.length }
		},
		reset() {
			hits.clear()
			opsSinceSweep = 0
		},
	}
}

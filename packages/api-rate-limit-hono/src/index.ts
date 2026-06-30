import { createRateLimiter, type RateLimiterOptions } from '@rtorcato/api-rate-limit'
import type { MiddlewareHandler } from 'hono'

/**
 * Hono middleware that applies a sliding-window rate limit.
 *
 * Keys on `X-Forwarded-For` → `X-Real-IP` → `'unknown'`.
 * Responds `429` with `{ success: false, code: 'rate_limited', message }` when
 * the limit is exceeded — matching the envelope shape from `@rtorcato/api-errors`.
 */
export function rateLimitMiddleware(options: RateLimiterOptions): MiddlewareHandler {
	const limiter = createRateLimiter(options)
	return async (c, next) => {
		const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown'
		const result = limiter.check(ip)
		if (!result.allowed) {
			return c.json({ success: false, code: 'rate_limited', message: 'Too many requests' }, 429)
		}
		return next()
	}
}

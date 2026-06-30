import { getIP } from '@rtorcato/api-express-utils'
import { createRateLimiter, type RateLimiterOptions } from '@rtorcato/api-rate-limit'
import type { RequestHandler } from 'express'

/**
 * Express middleware that applies a sliding-window rate limit.
 *
 * Keys on the client IP extracted by `getIP` (respects `X-Forwarded-For`).
 * Responds `429` with `{ success: false, code: 'rate_limited', message }` when
 * the limit is exceeded — matching the envelope shape from `@rtorcato/api-errors`.
 */
export function rateLimitMiddleware(options: RateLimiterOptions): RequestHandler {
	const limiter = createRateLimiter(options)
	return (req, res, next) => {
		const result = limiter.check(getIP(req) ?? 'unknown')
		if (!result.allowed) {
			res.status(429).json({ success: false, code: 'rate_limited', message: 'Too many requests' })
			return
		}
		next()
	}
}

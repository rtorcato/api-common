import { TooManyRequestsError, toErrorResponse } from '@rtorcato/api-errors'
import { createRateLimiter, type RateLimiterOptions } from '@rtorcato/api-rate-limit'
import type { MiddlewareHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/**
 * Hono middleware that applies a sliding-window rate limit.
 *
 * Keys on `X-Forwarded-For` → `X-Real-IP` → `'unknown'`.
 * Responds `429` with the standard error envelope
 * `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }` from
 * `@rtorcato/api-errors`, so clients parse it like any other error.
 */
export function rateLimitMiddleware(options: RateLimiterOptions): MiddlewareHandler {
	const limiter = createRateLimiter(options)
	return async (c, next) => {
		const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown'
		const result = await limiter.check(ip)
		if (!result.allowed) {
			const err = new TooManyRequestsError()
			return c.json(toErrorResponse(err), err.status as ContentfulStatusCode)
		}
		return next()
	}
}

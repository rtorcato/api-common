import { TooManyRequestsError, toErrorResponse } from '../../errors/index.js'
import { getIP } from '../../express-utils/index.js'
import { createRateLimiter, type RateLimiterOptions } from '../index.js'
import type { RequestHandler } from 'express'

/**
 * Express middleware that applies a sliding-window rate limit.
 *
 * Keys on the client IP extracted by `getIP` (respects `X-Forwarded-For`).
 * Responds `429` with the standard error envelope
 * `{ error: 'TooManyRequestsError', code: 'too_many_requests', message }` from
 * `@rtorcato/api-common/errors`, so clients parse it like any other error.
 */
export function rateLimitMiddleware(options: RateLimiterOptions): RequestHandler {
	const limiter = createRateLimiter(options)
	return (req, res, next) => {
		// Catch store rejections explicitly and forward — Express 4 doesn't await
		// async handlers, so a rejected promise would otherwise go unhandled.
		limiter.check(getIP(req) ?? 'unknown').then((result) => {
			if (!result.allowed) {
				const err = new TooManyRequestsError()
				res.status(err.status).json(toErrorResponse(err))
				return
			}
			next()
		}, next)
	}
}

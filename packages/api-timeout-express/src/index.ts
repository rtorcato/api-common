import { ServiceUnavailableError, toErrorResponse } from '@rtorcato/api-errors'
import { type TimeoutOptions, withTimeout } from '@rtorcato/api-timeout'
import type { RequestHandler } from 'express'

/**
 * Express middleware that fails a request with `503` if the response isn't sent
 * within `ms`. Responds with the standard error envelope
 * `{ error: 'ServiceUnavailableError', code: 'service_unavailable', message }`
 * from `@rtorcato/api-errors`. If the handler responds first, the timer is
 * cleared and nothing extra is sent.
 *
 * ponytail: on timeout we send 503 and stop; a slow handler that later tries to
 * write will hit Express's "headers already sent" — guard late writes with
 * `res.headersSent` in long handlers.
 */
export function timeoutMiddleware({ ms }: TimeoutOptions): RequestHandler {
	return (_req, res, next) => {
		const settled = new Promise<void>((resolve) => {
			res.on('finish', resolve)
			res.on('close', resolve)
		})
		withTimeout(settled, ms).catch((err: unknown) => {
			if (res.headersSent) return
			const e = err instanceof ServiceUnavailableError ? err : new ServiceUnavailableError()
			res.status(e.status).json(toErrorResponse(e))
		})
		next()
	}
}

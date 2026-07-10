import { ServiceUnavailableError, toErrorResponse } from '@rtorcato/api-errors'
import { type TimeoutOptions, withTimeout } from '@rtorcato/api-timeout'
import type { MiddlewareHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

/**
 * Hono middleware that fails a request with `503` if downstream handlers don't
 * finish within `ms`. Responds with the standard error envelope
 * `{ error: 'ServiceUnavailableError', code: 'service_unavailable', message }`
 * from `@rtorcato/api-errors`. Non-timeout errors bubble up to Hono's
 * `onError` unchanged.
 *
 * ponytail: on timeout the downstream handler keeps running in the background
 * (JS has no cancellation); its response is discarded.
 */
export function timeoutMiddleware({ ms }: TimeoutOptions): MiddlewareHandler {
	return async (c, next) => {
		try {
			await withTimeout(next(), ms)
			return
		} catch (err) {
			if (err instanceof ServiceUnavailableError) {
				return c.json(toErrorResponse(err), err.status as ContentfulStatusCode)
			}
			throw err
		}
	}
}

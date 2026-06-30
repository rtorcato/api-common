import { HttpError } from '@rtorcato/api-errors'
import { isDev } from '@rtorcato/js-common/env'
import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type ErrorHandlerOptions = {
	includeStack?: boolean
}

export function errorHandler(options: ErrorHandlerOptions = {}): ErrorHandler {
	const includeStack = options.includeStack ?? isDev()

	return (err, c) => {
		const isHttp = err instanceof HttpError
		const status = (isHttp ? err.status : 500) as ContentfulStatusCode
		const code = isHttp ? err.code : 'internal_server_error'
		const name = err?.name ?? 'InternalServerError'
		const message = err?.message ?? 'An unexpected error occurred.'

		return c.json(
			{
				error: name,
				code,
				message,
				...(includeStack && err?.stack ? { stack: err.stack } : {}),
			},
			status
		)
	}
}

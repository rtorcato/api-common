import { HttpError, toErrorResponse } from '../index.js'
import { isDev } from '@rtorcato/js-common/env'
import type { ErrorHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type ErrorHandlerOptions = {
	includeStack?: boolean
}

export function errorHandler(options: ErrorHandlerOptions = {}): ErrorHandler {
	const includeStack = options.includeStack ?? isDev()

	return (err, c) => {
		const status = (err instanceof HttpError ? err.status : 500) as ContentfulStatusCode
		return c.json(toErrorResponse(err, { includeStack }), status)
	}
}

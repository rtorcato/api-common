import { HttpError, toErrorResponse } from '@rtorcato/api-errors'
import { isDev } from '@rtorcato/js-common/env'
import type { ErrorRequestHandler } from 'express'

export type ErrorHandlerOptions = {
	includeStack?: boolean
}

export function errorHandler(options: ErrorHandlerOptions = {}): ErrorRequestHandler {
	const includeStack = options.includeStack ?? isDev()

	return (err, _req, res, _next) => {
		const status = err instanceof HttpError ? err.status : 500
		res.status(status).json(toErrorResponse(err, { includeStack }))
	}
}

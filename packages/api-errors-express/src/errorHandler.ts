import { HttpError } from '@rtorcato/api-errors'
import type { ErrorRequestHandler } from 'express'

export type ErrorHandlerOptions = {
	includeStack?: boolean
}

export function errorHandler(options: ErrorHandlerOptions = {}): ErrorRequestHandler {
	const includeStack = options.includeStack ?? process.env['NODE_ENV'] === 'development'

	return (err, _req, res, _next) => {
		const isHttp = err instanceof HttpError
		const status = isHttp ? err.status : 500
		const code = isHttp ? err.code : 'internal_server_error'
		const name = err?.name ?? 'InternalServerError'
		const message = err?.message ?? 'An unexpected error occurred.'

		res.status(status).json({
			error: name,
			code,
			message,
			...(includeStack && err?.stack ? { stack: err.stack } : {}),
		})
	}
}

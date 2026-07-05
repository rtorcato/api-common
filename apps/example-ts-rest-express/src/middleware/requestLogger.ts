import type { RequestHandler } from 'express'

interface Logger {
	info(obj: object): void
}

/**
 * Example local middleware — shows how to add app-specific middleware
 * alongside the published @rtorcato/api-* packages.
 *
 * Logs method, path, status, and duration for every request.
 */
export function requestLogger(log: Logger): RequestHandler {
	return (req, res, next) => {
		const start = Date.now()
		res.on('finish', () => {
			log.info({
				method: req.method,
				path: req.path,
				status: res.statusCode,
				ms: Date.now() - start,
			})
		})
		next()
	}
}

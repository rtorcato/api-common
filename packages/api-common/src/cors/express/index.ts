import cors from 'cors'
import type { RequestHandler } from 'express'

export interface CorsOptions {
	/** Allowed origins. String, array of strings/regexps, or a predicate. */
	origin:
		| string
		| string[]
		| RegExp
		| (string | RegExp)[]
		| ((origin: string | undefined) => boolean)
	/** Include credentials (cookies, auth headers). Default: true. */
	credentials?: boolean
	/** Allowed HTTP methods. Default: GET POST PUT PATCH DELETE OPTIONS. */
	methods?: string[]
	/** Allowed request headers. Default: Content-Type, Authorization. */
	allowedHeaders?: string[]
	/** Preflight cache duration in seconds. Default: 600. */
	maxAge?: number
}

const DEFAULT_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
const DEFAULT_HEADERS = ['Content-Type', 'Authorization']

export function corsMiddleware(options: CorsOptions): RequestHandler {
	const {
		origin,
		credentials = true,
		methods = DEFAULT_METHODS,
		allowedHeaders = DEFAULT_HEADERS,
		maxAge = 600,
	} = options

	// cors treats a bare string as a static header (always set, no matching).
	// Wrap in array so it does proper request-origin matching.
	const normalizedOrigin =
		typeof origin === 'function'
			? (o: string | undefined, cb: (err: Error | null, allow?: boolean) => void) =>
					cb(null, origin(o))
			: typeof origin === 'string'
				? [origin]
				: origin

	return cors({
		origin: normalizedOrigin,
		credentials,
		methods,
		allowedHeaders,
		maxAge,
		optionsSuccessStatus: 204,
	}) as RequestHandler
}

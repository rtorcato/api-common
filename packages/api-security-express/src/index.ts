import type { RequestHandler } from 'express'
import helmet from 'helmet'

export interface SecurityOptions {
	/**
	 * Enable helmet's Content-Security-Policy. helmet's default CSP is tuned for
	 * HTML apps and routinely blocks assets on a JSON API, so it's **off** by
	 * default here. Turn it on if this service also serves HTML.
	 *
	 * Default: `false`.
	 */
	contentSecurityPolicy?: boolean
	/**
	 * Enable HTTP Strict-Transport-Security (tells browsers to use HTTPS for
	 * future requests). Turn off for plain-HTTP local development.
	 *
	 * Default: `true`.
	 */
	hsts?: boolean
}

/**
 * Express security-headers middleware — a thin wrapper over
 * [helmet](https://helmetjs.github.io/) with API-friendly defaults. Sets
 * `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
 * `Strict-Transport-Security`, and the rest of helmet's header suite.
 *
 * Hono ships `secureHeaders` built in, so this adapter is Express-only.
 *
 * @example
 * import { securityMiddleware } from '@rtorcato/api-security-express'
 * app.use(securityMiddleware())
 */
export function securityMiddleware(options: SecurityOptions = {}): RequestHandler {
	const { contentSecurityPolicy = false, hsts = true } = options
	// `undefined` = use helmet's default for that header; `false` = disable it.
	return helmet({
		contentSecurityPolicy: contentSecurityPolicy ? undefined : false,
		hsts: hsts ? undefined : false,
	}) as RequestHandler
}

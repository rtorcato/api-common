import type { RequestHandler } from 'express'
import helmet from 'helmet'

/** Options accepted by helmet — see https://helmetjs.github.io/. */
export type SecurityOptions = Parameters<typeof helmet>[0]

/**
 * Express security-headers middleware — a thin wrapper over
 * [helmet](https://helmetjs.github.io/) that applies its full, sane default
 * header suite: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
 * `Strict-Transport-Security`, a default `Content-Security-Policy`, and more.
 *
 * Call it with no arguments for helmet's secure defaults, or pass any helmet
 * option to customize. Hono ships `secureHeaders` built in, so this adapter is
 * Express-only.
 *
 * @example
 * app.use(securityMiddleware())
 *
 * @example
 * // Serving HTML with a custom Content-Security-Policy:
 * app.use(securityMiddleware({
 *   contentSecurityPolicy: { directives: { 'script-src': ["'self'"] } },
 * }))
 */
export function securityMiddleware(options?: SecurityOptions): RequestHandler {
	return helmet(options) as RequestHandler
}

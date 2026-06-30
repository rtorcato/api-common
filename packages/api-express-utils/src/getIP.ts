import type { Request } from 'express'

/**
 * Extract the client IP from an Express request.
 *
 * Order: `X-Forwarded-For` (leftmost entry) → `req.ip` → `socket.remoteAddress`.
 *
 * SECURITY: `X-Forwarded-For` is client-supplied and trivially spoofable unless
 * the request passed through a proxy you control that overwrites it. If you are
 * behind a trusted proxy, prefer configuring `app.set('trust proxy', …)` and
 * reading `req.ip` directly — Express then validates the hop chain for you.
 * Only rely on this helper's XFF parsing for logging/analytics, never for
 * authorization or rate-limit keys on untrusted ingress.
 */
export function getIP(req: Request): string | undefined {
	const forwarded = req.headers['x-forwarded-for']
	const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded
	const first = raw?.split(',')[0]?.trim()
	return first || req.ip || req.socket?.remoteAddress
}

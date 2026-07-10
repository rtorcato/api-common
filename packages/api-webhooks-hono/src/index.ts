import { toErrorResponse, UnauthorizedError } from '@rtorcato/api-errors'
import { type SignatureOptions, verifySignature } from '@rtorcato/api-webhooks'
import type { MiddlewareHandler } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export interface WebhookOptions extends SignatureOptions {
	/** Shared secret used to compute the expected HMAC. */
	secret: string
	/** Request header carrying the signature. Default: `'x-signature'`. */
	header?: string
}

/**
 * Hono webhook middleware: verifies the HMAC signature over the **raw** request
 * body. Responds `401` with the standard `@rtorcato/api-errors` envelope on a
 * missing/invalid signature.
 *
 * Hono buffers the request body, so a downstream handler can still call
 * `c.req.json()` after this middleware has read it as text:
 *
 * ```ts
 * app.post('/webhooks/github', webhookMiddleware({
 *   secret: env.WEBHOOK_SECRET,
 *   header: 'x-hub-signature-256',
 *   prefix: 'sha256=',
 * }), async (c) => {
 *   const payload = await c.req.json()
 *   return c.body(null, 204)
 * })
 * ```
 */
export function webhookMiddleware(options: WebhookOptions): MiddlewareHandler {
	const { secret, header = 'x-signature', ...signatureOptions } = options
	return async (c, next) => {
		const signature = c.req.header(header)
		const raw = await c.req.text()
		if (!verifySignature(raw, signature, secret, signatureOptions)) {
			const err = new UnauthorizedError('Invalid webhook signature')
			return c.json(toErrorResponse(err), err.status as ContentfulStatusCode)
		}
		return next()
	}
}

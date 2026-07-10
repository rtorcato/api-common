import { BadRequestError, toErrorResponse, UnauthorizedError } from '@rtorcato/api-errors'
import { type SignatureOptions, verifySignature } from '@rtorcato/api-webhooks'
import express, { type RequestHandler } from 'express'

export interface WebhookOptions extends SignatureOptions {
	/** Shared secret used to compute the expected HMAC. */
	secret: string
	/** Request header carrying the signature. Default: `'x-signature'`. */
	header?: string
}

/**
 * Express webhook middleware: captures the **raw** request body, verifies its
 * HMAC signature, then parses the JSON onto `req.body` for downstream handlers.
 *
 * Returns an array of handlers — mount it as the route's middleware, **before**
 * any `express.json()`, which would otherwise consume the raw body needed to
 * verify the signature:
 *
 * ```ts
 * app.post('/webhooks/github', webhookMiddleware({
 *   secret: env.WEBHOOK_SECRET,
 *   header: 'x-hub-signature-256',
 *   prefix: 'sha256=',
 * }), (req, res) => {
 *   // req.body is the parsed, verified payload
 *   res.sendStatus(204)
 * })
 * ```
 *
 * Responds `401` on a missing/invalid signature and `400` on an unparseable
 * JSON body, using the standard `@rtorcato/api-errors` envelope.
 */
export function webhookMiddleware(options: WebhookOptions): RequestHandler[] {
	const { secret, header = 'x-signature', ...signatureOptions } = options
	const captureRaw = express.raw({ type: '*/*' })

	const verify: RequestHandler = (req, res, next) => {
		const signature = req.header(header)
		const raw: Buffer = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0)

		if (!verifySignature(raw, signature, secret, signatureOptions)) {
			const err = new UnauthorizedError('Invalid webhook signature')
			res.status(err.status).json(toErrorResponse(err))
			return
		}

		try {
			req.body = raw.length ? JSON.parse(raw.toString('utf8')) : {}
		} catch {
			const err = new BadRequestError('Invalid webhook JSON body')
			res.status(err.status).json(toErrorResponse(err))
			return
		}
		next()
	}

	return [captureRaw, verify]
}

import { createHmac, timingSafeEqual } from 'node:crypto'

export interface SignatureOptions {
	/** HMAC hash algorithm. Default: `'sha256'`. */
	algorithm?: string
	/**
	 * Prefix carried on the signature header value (included in both the computed
	 * and the compared value), e.g. GitHub's `'sha256='`. Default: `''`.
	 */
	prefix?: string
}

/**
 * Compute the hex HMAC signature for a raw webhook payload.
 *
 * @example
 * const sig = sign(rawBody, secret, { prefix: 'sha256=' })
 */
export function sign(
	payload: string | Buffer,
	secret: string,
	options: SignatureOptions = {}
): string {
	const { algorithm = 'sha256', prefix = '' } = options
	return prefix + createHmac(algorithm, secret).update(payload).digest('hex')
}

/**
 * Timing-safe check that `signature` is a valid HMAC of `payload` for `secret`.
 *
 * Framework-agnostic — verify the **raw** request body (not a re-serialized
 * object) against the provider's signature header. Wrap it for Express/Hono in a
 * dedicated adapter package.
 *
 * @example
 * if (!verifySignature(rawBody, req.header('x-hub-signature-256'), secret, { prefix: 'sha256=' })) {
 *   throw new UnauthorizedError('Invalid webhook signature')
 * }
 */
export function verifySignature(
	payload: string | Buffer,
	signature: string | undefined | null,
	secret: string,
	options: SignatureOptions = {}
): boolean {
	if (!signature) return false
	const expected = Buffer.from(sign(payload, secret, options))
	const actual = Buffer.from(signature)
	// timingSafeEqual throws on length mismatch — short-circuit first.
	if (expected.length !== actual.length) return false
	return timingSafeEqual(expected, actual)
}

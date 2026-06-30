import jwt from 'jsonwebtoken'
import { UnauthorizedError } from '@rtorcato/api-errors'

export function signToken(
	payload: string | object | Buffer,
	secret: jwt.Secret,
	options?: jwt.SignOptions
): string {
	return jwt.sign(payload, secret, options)
}

export function verifyToken<T = jwt.JwtPayload>(
	token: string,
	secret: jwt.Secret | jwt.GetPublicKeyOrSecret,
	options?: jwt.VerifyOptions
): T {
	try {
		return jwt.verify(token, secret, options) as T
	} catch {
		throw new UnauthorizedError('Invalid or expired token', 'invalid_token')
	}
}

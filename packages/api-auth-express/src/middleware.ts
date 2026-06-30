import {
	findToken,
	verifyToken,
	type JwtPayload,
	type Secret,
	type VerifyOptions,
} from '@rtorcato/api-auth'
import { UnauthorizedError } from '@rtorcato/api-errors'
import type { RequestHandler } from 'express'

// Augment Express.Request so req.user is typed across the consumer's app
declare global {
	namespace Express {
		interface Request {
			user?: JwtPayload
		}
	}
}

interface AuthOptions {
	cookieName?: string
	verifyOptions?: VerifyOptions
}

export function authMiddleware(secret: Secret, options: AuthOptions = {}): RequestHandler {
	return (req, _res, next) => {
		const token = findToken(req, { cookieName: options.cookieName })
		if (!token) {
			next(new UnauthorizedError('No token provided', 'missing_token'))
			return
		}
		try {
			req.user = verifyToken<JwtPayload>(token, secret, options.verifyOptions)
			next()
		} catch (err) {
			next(err)
		}
	}
}

export function optionalAuthMiddleware(secret: Secret, options: AuthOptions = {}): RequestHandler {
	return (req, _res, next) => {
		const token = findToken(req, { cookieName: options.cookieName })
		if (token) {
			try {
				req.user = verifyToken<JwtPayload>(token, secret, options.verifyOptions)
			} catch {
				// ponytail: silently skip invalid token — optional auth never blocks the request
			}
		}
		next()
	}
}

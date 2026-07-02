import {
	findToken,
	type JwtPayload,
	type Secret,
	verifyToken,
	type VerifyOptions,
} from '@rtorcato/api-auth'
import { UnauthorizedError } from '@rtorcato/api-errors'
import { getCookie } from 'hono/cookie'
import type { MiddlewareHandler } from 'hono'

// Consumers type their app with `new Hono<{ Variables: AuthVariables }>()` to get a typed `c.get('user')`.
export type AuthVariables = { user: JwtPayload }

interface AuthOptions {
	cookieName?: string
	verifyOptions?: VerifyOptions
}

export function authMiddleware(
	secret: Secret,
	options: AuthOptions = {}
): MiddlewareHandler<{ Variables: AuthVariables }> {
	return async (c, next) => {
		const token = findToken(
			{ headers: { authorization: c.req.header('authorization') }, cookies: getCookie(c) },
			{ cookieName: options.cookieName }
		)
		if (!token) throw new UnauthorizedError('No token provided', 'missing_token')
		c.set('user', verifyToken<JwtPayload>(token, secret, options.verifyOptions))
		return next()
	}
}

export function optionalAuthMiddleware(
	secret: Secret,
	options: AuthOptions = {}
): MiddlewareHandler<{ Variables: AuthVariables }> {
	return async (c, next) => {
		const token = findToken(
			{ headers: { authorization: c.req.header('authorization') }, cookies: getCookie(c) },
			{ cookieName: options.cookieName }
		)
		if (token) {
			try {
				c.set('user', verifyToken<JwtPayload>(token, secret, options.verifyOptions))
			} catch {
				// ponytail: silently skip invalid token — optional auth never blocks the request
			}
		}
		return next()
	}
}

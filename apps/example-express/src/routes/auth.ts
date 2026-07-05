import { signToken } from '@rtorcato/api-auth'
import { authMiddleware } from '@rtorcato/api-auth-express'
import { ok } from '@rtorcato/api-response'
import { Router } from 'express'

// Demo auth: POST /login mints a short-lived JWT for whatever username you send
// (no password check — this is an example), GET /me echoes the verified claims.
export function createAuthRouter(jwtSecret: string) {
	const router = Router()

	router.post('/login', (req, res) => {
		const { username } = req.body as { username?: string }
		res.json(ok({ token: signToken({ sub: username }, jwtSecret, { expiresIn: '1h' }) }))
	})

	router.get('/me', authMiddleware(jwtSecret), (req, res) => {
		res.json(ok({ user: req.user }))
	})

	return router
}

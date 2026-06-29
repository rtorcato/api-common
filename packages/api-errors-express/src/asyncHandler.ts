import type { NextFunction, Request, RequestHandler, Response } from 'express'

/**
 * Wraps an async Express route handler so any rejection is forwarded to
 * `next(err)`, letting `errorHandler` deal with it instead of per-route
 * try/catch.
 *
 * @example
 * app.get('/users/:id', asyncHandler(async (req, res) => {
 *   const user = await db.findUser(req.params.id)
 *   if (!user) throw new NotFoundError()
 *   res.json(user)
 * }))
 */
export function asyncHandler(
	fn: (req: Request, res: Response, next: NextFunction) => unknown
): RequestHandler {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next)
	}
}

import { NotFoundError } from '@rtorcato/api-errors'
import type { NextFunction, Request, Response } from 'express'

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
	next(new NotFoundError(`The requested URL ${req.originalUrl} was not found on this server.`))
}

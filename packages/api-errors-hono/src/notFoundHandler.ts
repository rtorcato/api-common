import { NotFoundError } from '@rtorcato/api-errors'
import type { NotFoundHandler } from 'hono'

export const notFoundHandler: NotFoundHandler = (c) => {
	throw new NotFoundError(`The requested URL ${c.req.url} was not found on this server.`)
}

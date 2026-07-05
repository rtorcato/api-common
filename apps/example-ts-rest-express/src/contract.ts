import { initContract, withDefaultErrors } from '@rtorcato/api-ts-rest-express'
import { successSchema } from '@rtorcato/api-response'
import { z } from 'zod'

// Shared Zod schemas — the single source of truth. ts-rest validates requests
// against them AND generates the OpenAPI doc from them, so the API, its
// validation, and its docs can't drift.
export const itemSchema = z.object({ id: z.uuid(), name: z.string() })
export const createItemBody = z.object({ name: z.string().min(1) })
export const itemParams = z.object({ id: z.string() })
export type Item = z.infer<typeof itemSchema>

const c = initContract()

// `withDefaultErrors` attaches the shared 400/404/500 error envelope
// (`@rtorcato/api-errors-express` shape) to every route's responses.
export const contract = c.router({
	getItems: {
		method: 'GET',
		path: '/items',
		summary: 'List items',
		responses: withDefaultErrors({ 200: successSchema(z.array(itemSchema)) }),
	},
	createItem: {
		method: 'POST',
		path: '/items',
		summary: 'Create an item',
		body: createItemBody,
		responses: withDefaultErrors({ 201: successSchema(itemSchema) }),
	},
	getItem: {
		method: 'GET',
		path: '/items/:id',
		summary: 'Get an item',
		pathParams: itemParams,
		responses: withDefaultErrors({ 200: successSchema(itemSchema) }),
	},
	deleteItem: {
		method: 'DELETE',
		path: '/items/:id',
		summary: 'Delete an item',
		pathParams: itemParams,
		responses: withDefaultErrors({ 200: successSchema(z.object({ deleted: z.boolean() })) }),
	},
})

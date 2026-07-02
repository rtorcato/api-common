import { buildOpenApiDocument } from '@rtorcato/api-openapi'
import { errorSchema, successSchema } from '@rtorcato/api-response'
import { z } from 'zod'
import { createItemBody, itemParams, itemSchema } from './routes/items.js'

// Schema-first: the OpenAPI 3.1 spec is derived from the same Zod schemas the
// routes validate with (createItemBody, itemParams) and return (itemSchema
// wrapped in the api-response success envelope), so the docs can't drift.
export const spec = buildOpenApiDocument({
	info: { title: 'Example Express API', version: '1.0.0' },
	routes: [
		{
			method: 'get',
			path: '/items',
			summary: 'List items',
			responses: {
				200: { description: 'Success', schema: successSchema(z.array(itemSchema)) },
			},
		},
		{
			method: 'post',
			path: '/items',
			summary: 'Create an item',
			request: { body: createItemBody },
			responses: {
				201: { description: 'Created', schema: successSchema(itemSchema) },
				400: { description: 'Validation error', schema: errorSchema() },
			},
		},
		{
			method: 'get',
			path: '/items/:id',
			summary: 'Get an item',
			request: { params: itemParams },
			responses: {
				200: { description: 'Success', schema: successSchema(itemSchema) },
				404: { description: 'Not found', schema: errorSchema() },
			},
		},
		{
			method: 'delete',
			path: '/items/:id',
			summary: 'Delete an item',
			request: { params: itemParams },
			responses: {
				200: { description: 'Deleted', schema: successSchema(z.object({ deleted: z.boolean() })) },
				404: { description: 'Not found', schema: errorSchema() },
			},
		},
	],
})

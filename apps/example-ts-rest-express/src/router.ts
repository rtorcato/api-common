import { NotFoundError, toErrorResponse } from '@rtorcato/api-errors'
import { ok } from '@rtorcato/api-response'
import { initServer } from '@rtorcato/api-ts-rest-express'
import { contract, type Item } from './contract.js'

/**
 * Build the ts-rest router implementation over a fresh in-memory store.
 * A factory (not a singleton) so each `createApp()` — and each test — starts
 * from an empty list.
 *
 * Expected errors (a missing item) are returned as a typed `404` whose body is
 * the shared error envelope from `@rtorcato/api-errors`. Unexpected throws
 * propagate to Express's `errorHandler()` as a `500`.
 */
export function createRouter() {
	const items: Item[] = []
	const s = initServer()

	return s.router(contract, {
		getItems: async () => ({ status: 200, body: ok(items) }),

		createItem: async ({ body }) => {
			const item: Item = { id: crypto.randomUUID(), name: body.name }
			items.push(item)
			return { status: 201, body: ok(item) }
		},

		getItem: async ({ params: { id } }) => {
			const item = items.find((i) => i.id === id)
			if (!item) {
				return { status: 404, body: toErrorResponse(new NotFoundError(`Item ${id} not found`)) }
			}
			return { status: 200, body: ok(item) }
		},

		deleteItem: async ({ params: { id } }) => {
			const idx = items.findIndex((i) => i.id === id)
			if (idx === -1) {
				return { status: 404, body: toErrorResponse(new NotFoundError(`Item ${id} not found`)) }
			}
			items.splice(idx, 1)
			return { status: 200, body: ok({ deleted: true }) }
		},
	})
}

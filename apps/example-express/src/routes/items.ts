import { NotFoundError } from '@rtorcato/api-errors'
import { ok } from '@rtorcato/api-response'
import { validate } from '@rtorcato/api-validation'
import { Router } from 'express'
import { z } from 'zod'

// Shared Zod schemas — the single source of truth for both request validation
// (below) and the OpenAPI spec (src/spec.ts), so docs can't drift from the API.
export const createItemBody = z.object({ name: z.string().min(1) })
export const itemParams = z.object({ id: z.string() })
export const itemSchema = z.object({ id: z.uuid(), name: z.string() })
type Item = z.infer<typeof itemSchema>

export function createItemsRouter() {
	const items: Item[] = []
	const router = Router()

	router.get('/', (_req, res) => {
		res.json(ok(items))
	})

	router.post('/', (req, res) => {
		const body = validate(createItemBody, req.body)
		const item: Item = { id: crypto.randomUUID(), name: body.name }
		items.push(item)
		res.status(201).json(ok(item))
	})

	router.get('/:id', (req, res) => {
		const item = items.find((i) => i.id === req.params['id'])
		if (!item) throw new NotFoundError(`Item ${req.params['id']} not found`)
		res.json(ok(item))
	})

	router.delete('/:id', (req, res) => {
		const idx = items.findIndex((i) => i.id === req.params['id'])
		if (idx === -1) throw new NotFoundError(`Item ${req.params['id']} not found`)
		items.splice(idx, 1)
		res.json(ok({ deleted: true }))
	})

	return router
}

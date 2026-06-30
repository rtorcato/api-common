import { NotFoundError } from '@rtorcato/api-errors'
import { ok } from '@rtorcato/api-response'
import { validate } from '@rtorcato/api-validation'
import { Router } from 'express'
import { z } from 'zod'

const itemSchema = z.object({ name: z.string().min(1) })
type Item = { id: string; name: string }
const items: Item[] = []

export const itemsRouter = Router()

itemsRouter.get('/', (_req, res) => {
	res.json(ok(items))
})

itemsRouter.post('/', (req, res) => {
	const body = validate(itemSchema, req.body)
	const item: Item = { id: crypto.randomUUID(), name: body.name }
	items.push(item)
	res.status(201).json(ok(item))
})

itemsRouter.get('/:id', (req, res) => {
	const item = items.find((i) => i.id === req.params['id'])
	if (!item) throw new NotFoundError(`Item ${req.params['id']} not found`)
	res.json(ok(item))
})

itemsRouter.delete('/:id', (req, res) => {
	const idx = items.findIndex((i) => i.id === req.params['id'])
	if (idx === -1) throw new NotFoundError(`Item ${req.params['id']} not found`)
	items.splice(idx, 1)
	res.json(ok({ deleted: true }))
})

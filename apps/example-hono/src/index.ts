import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'
import { loadEnv } from '@rtorcato/api-config'
import { NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'
import { createLogger } from '@rtorcato/api-logger'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-hono'
import { ok } from '@rtorcato/api-response'
import { validate } from '@rtorcato/api-validation'
import { Hono } from 'hono'
import { z } from 'zod'
import { spec } from './spec.js'

const env = loadEnv(
	z.object({
		PORT: z.coerce.number().default(3002),
		LOG_LEVEL: z.string().default('info'),
	})
)

const log = createLogger({ level: env.LOG_LEVEL })

const itemSchema = z.object({ name: z.string().min(1) })
type Item = { id: string; name: string }
const items: Item[] = []

const app = new Hono()

app.get('/api-docs/json', (c) => c.json(spec))
app.get('/api-docs', swaggerUI({ url: '/api-docs/json' }))

app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000 }))

app.get('/items', (c) => c.json(ok(items)))

app.post('/items', async (c) => {
	const body = validate(itemSchema, await c.req.json())
	const item: Item = { id: crypto.randomUUID(), name: body.name }
	items.push(item)
	return c.json(ok(item), 201)
})

app.get('/items/:id', (c) => {
	const item = items.find((i) => i.id === c.req.param('id'))
	if (!item) throw new NotFoundError(`Item ${c.req.param('id')} not found`)
	return c.json(ok(item))
})

app.delete('/items/:id', (c) => {
	const idx = items.findIndex((i) => i.id === c.req.param('id'))
	if (idx === -1) throw new NotFoundError(`Item ${c.req.param('id')} not found`)
	items.splice(idx, 1)
	return c.json(ok({ deleted: true }))
})

app.notFound(notFoundHandler)
app.onError(errorHandler())

serve({ fetch: app.fetch, port: env.PORT }, () => {
	log.info(`hono example listening on :${env.PORT}`)
	log.info(`swagger UI → http://localhost:${env.PORT}/api-docs`)
})

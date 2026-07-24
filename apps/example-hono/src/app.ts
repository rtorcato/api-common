import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { signToken } from '@rtorcato/api-auth'
import { type AuthVariables, authMiddleware } from '@rtorcato/api-auth-hono'
import { BadRequestError, NotFoundError } from '@rtorcato/api-errors'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-hono'
import { configureOpenAPI } from '@rtorcato/api-openapi-hono'
import { memoryStore } from '@rtorcato/api-rate-limit'
import { rateLimitMiddleware } from '@rtorcato/api-rate-limit-hono'
import { ok } from '@rtorcato/api-response'
import { timeoutMiddleware } from '@rtorcato/api-timeout-hono'
import { webhookMiddleware } from '@rtorcato/api-webhooks-hono'

// Schema-first: these Zod schemas drive request validation AND the generated
// OpenAPI doc, so the API and its docs can't drift.
const ItemSchema = z.object({ id: z.string(), name: z.string() })
const CreateItemBody = z.object({ name: z.string().min(1) })
const IdParam = z.object({ id: z.string() })
const success = <T extends z.ZodType>(data: T) => z.object({ success: z.literal(true), data })
// Mirrors the envelope emitted by @rtorcato/api-errors-hono.
const ErrorSchema = z.object({
	error: z.string(),
	code: z.string(),
	message: z.string(),
	stack: z.string().optional(),
})

type Item = z.infer<typeof ItemSchema>

export interface AppOptions {
	jwtSecret?: string
	webhookSecret?: string
}

export function createApp(options: AppOptions = {}) {
	const jwtSecret = options.jwtSecret ?? 'dev-secret'
	const { webhookSecret } = options
	const items: Item[] = []

	const app = new OpenAPIHono<{ Variables: AuthVariables }>({
		// Failed request validation flows through the shared error envelope
		// (@rtorcato/api-errors-hono) instead of Hono's default 400 shape.
		defaultHook: (result) => {
			if (!result.success) throw new BadRequestError('Validation failed', 'validation_error')
		},
	})

	// Probes registered before the rate limiter so they're never throttled.
	const health = createHealthRegistry()
	health.register('self', () => {})
	app.get('/healthz', livenessHandler())
	app.get('/readyz', readinessHandler(health))

	// Fail slow requests with a 503 instead of hanging the client.
	app.use(timeoutMiddleware({ ms: 10_000 }))
	// Single-process demo → in-memory store. Swap for redisStore() from
	// @rtorcato/api-rate-limit-redis to share limits across instances.
	app.use(rateLimitMiddleware({ requests: 100, windowMs: 60_000, store: memoryStore() }))

	// Webhook receiver (opt-in): verifies an HMAC signature over the raw body
	// before the handler runs. Gated on webhookSecret so the default app needs
	// no secret configured.
	if (webhookSecret) {
		app.post(
			'/webhooks',
			webhookMiddleware({
				secret: webhookSecret,
				header: 'x-hub-signature-256',
				prefix: 'sha256=',
			}),
			(c) => c.json(ok({ received: true }))
		)
	}

	// Auth: issue a token, then guard /me with it.
	app.post('/login', async (c) => {
		const body = await c.req.json<{ username?: string }>()
		const token = signToken({ sub: body.username ?? 'anonymous' }, jwtSecret, { expiresIn: '1h' })
		return c.json(ok({ token }))
	})
	app.use('/me', authMiddleware(jwtSecret))
	app.get('/me', (c) => c.json(ok({ user: c.get('user') })))

	// Items CRUD — documented, schema-first.
	app.openapi(
		createRoute({
			method: 'get',
			path: '/items',
			summary: 'List items',
			responses: {
				200: {
					description: 'Success',
					content: { 'application/json': { schema: success(z.array(ItemSchema)) } },
				},
			},
		}),
		(c) => c.json(ok(items), 200)
	)

	app.openapi(
		createRoute({
			method: 'post',
			path: '/items',
			summary: 'Create an item',
			request: { body: { content: { 'application/json': { schema: CreateItemBody } } } },
			responses: {
				201: {
					description: 'Created',
					content: { 'application/json': { schema: success(ItemSchema) } },
				},
				400: {
					description: 'Validation error',
					content: { 'application/json': { schema: ErrorSchema } },
				},
			},
		}),
		(c) => {
			const body = c.req.valid('json')
			const item: Item = { id: crypto.randomUUID(), name: body.name }
			items.push(item)
			return c.json(ok(item), 201)
		}
	)

	app.openapi(
		createRoute({
			method: 'get',
			path: '/items/{id}',
			summary: 'Get an item',
			request: { params: IdParam },
			responses: {
				200: {
					description: 'Success',
					content: { 'application/json': { schema: success(ItemSchema) } },
				},
				404: {
					description: 'Not found',
					content: { 'application/json': { schema: ErrorSchema } },
				},
			},
		}),
		(c) => {
			const { id } = c.req.valid('param')
			const item = items.find((i) => i.id === id)
			if (!item) throw new NotFoundError(`Item ${id} not found`)
			return c.json(ok(item), 200)
		}
	)

	app.openapi(
		createRoute({
			method: 'delete',
			path: '/items/{id}',
			summary: 'Delete an item',
			request: { params: IdParam },
			responses: {
				200: {
					description: 'Deleted',
					content: { 'application/json': { schema: success(z.object({ deleted: z.boolean() })) } },
				},
				404: {
					description: 'Not found',
					content: { 'application/json': { schema: ErrorSchema } },
				},
			},
		}),
		(c) => {
			const { id } = c.req.valid('param')
			const idx = items.findIndex((i) => i.id === id)
			if (idx === -1) throw new NotFoundError(`Item ${id} not found`)
			items.splice(idx, 1)
			return c.json(ok({ deleted: true }), 200)
		}
	)

	// Docs generated from the route schemas: GET /doc (OpenAPI 3.1) + GET /reference (Scalar).
	configureOpenAPI(app, { document: { info: { title: 'Example Hono API', version: '1.0.0' } } })

	app.notFound(notFoundHandler)
	app.onError(errorHandler())

	return app
}

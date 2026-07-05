import { mountOpenAPI, type MountOpenAPIOptions } from '@rtorcato/api-openapi-express'
import { errorSchema } from '@rtorcato/api-response'
import type { AppRoute, AppRouter, ServerInferRequest, ServerInferResponses } from '@ts-rest/core'
import { createExpressEndpoints } from '@ts-rest/express'
import { generateOpenApi } from '@ts-rest/open-api'
import type { IRouter } from 'express'
import type { z } from 'zod'

// Pulled from the installed @ts-rest/express signature (its RouterImplementation
// type isn't re-exported), so the cast below tracks the peer version.
type TsRestRouter = Parameters<typeof createExpressEndpoints>[1]
type EndpointOptions = Parameters<typeof createExpressEndpoints>[3]

export interface OpenApiConfig {
	info: { title: string; version: string; description?: string }
	/** Extra `generateOpenApi` options, e.g. `{ setOperationId: true }`. */
	options?: Parameters<typeof generateOpenApi>[2]
	/** Overrides for the docs mount (paths, UI, theme) — `doc` is supplied for you. */
	mount?: Omit<MountOpenAPIOptions, 'doc'>
}

export interface MountTsRestOptions {
	contract: AppRouter
	/**
	 * The implemented router from `initServer().router(contract, handlers)` — that
	 * call already type-checks the handlers against the contract, so it's accepted
	 * loosely here.
	 */
	router: unknown
	/** Passed to `createExpressEndpoints` (globalMiddleware, responseValidation, …). */
	endpointOptions?: EndpointOptions
	/** Generate an OpenAPI 3.1 doc from the contract and serve it (Scalar by default). */
	openapi?: OpenApiConfig
}

/**
 * Mount a ts-rest contract on an Express app/router and, optionally, serve its
 * OpenAPI docs — one call wiring `@ts-rest/express` + `@ts-rest/open-api` into the
 * api-common Scalar docs (`@rtorcato/api-openapi-express`).
 *
 * @example
 * ```ts
 * const s = initServer()
 * const router = s.router(contract, { getUser: async ({ params }) => ({ status: 200, body: … }) })
 * mountTsRest(app, { contract, router, openapi: { info: { title: 'My API', version: '1.0.0' } } })
 * // → contract routes are live; GET /openapi.json + GET /docs (Scalar)
 * ```
 */
export function mountTsRest(app: IRouter, options: MountTsRestOptions): void {
	createExpressEndpoints(
		options.contract,
		options.router as TsRestRouter,
		app,
		options.endpointOptions
	)

	if (options.openapi) {
		const doc = generateOpenApi(
			options.contract,
			{ openapi: '3.1.0', info: options.openapi.info },
			options.openapi.options
		)
		// mountOpenAPI accepts any target with Express-style `.get(path, handler)`.
		mountOpenAPI(app as unknown as Parameters<typeof mountOpenAPI>[0], {
			doc,
			...options.openapi.mount,
		})
	}
}

/** Server-side inferred request shape (params, query, body, headers) for a contract or route. */
export type RestRequest<T extends AppRouter | AppRoute> = ServerInferRequest<T>
/** Server-side inferred `{ status, body }` union for a contract or route's responses. */
export type RestResponse<T extends AppRouter | AppRoute> = ServerInferResponses<T>

/**
 * Zod schema for api-common's error envelope (`{ error, code, message, stack? }`),
 * the exact body emitted by `@rtorcato/api-errors-express`. Re-exported so contracts
 * and handlers reference one source of truth.
 */
export const defaultErrorSchema = errorSchema()

type DefaultErrorResponses = {
	400: ReturnType<typeof errorSchema>
	404: ReturnType<typeof errorSchema>
	500: ReturnType<typeof errorSchema>
}

/**
 * Attach the standard 400/404/500 error responses to a ts-rest route's `responses`
 * map, so every contract documents the shared error envelope without repeating it.
 * Statuses you define yourself win — pass a `400` and it overrides the default.
 *
 * @example
 * ```ts
 * getUser: {
 *   method: 'GET',
 *   path: '/users/:id',
 *   responses: withDefaultErrors({ 200: UserSchema }),
 * }
 * ```
 */
export function withDefaultErrors<T extends Record<number, z.ZodTypeAny>>(
	responses: T
): Omit<DefaultErrorResponses, keyof T> & T {
	return {
		400: defaultErrorSchema,
		404: defaultErrorSchema,
		500: defaultErrorSchema,
		...responses,
	} as Omit<DefaultErrorResponses, keyof T> & T
}

// Re-export the ts-rest entry points so consumers build contracts + servers from one import.
export { initContract } from '@ts-rest/core'
export { initServer } from '@ts-rest/express'

import { z } from 'zod'

/**
 * Schema-first OpenAPI 3.1 document builder.
 *
 * Assembles an OpenAPI document from route definitions whose request/response shapes are
 * Zod schemas (the same ones used for validation with `@rtorcato/api-validation`). Because the
 * spec derives from the schemas, the docs can't drift from what the API actually accepts and returns.
 *
 * Uses Zod 4's native `z.toJSONSchema` — no extra runtime dependency. `zod` is a peer dependency.
 */

/** A Zod schema — any type produced by `zod`. */
type ZodSchema = z.ZodType

export interface OpenApiInfo {
	title: string
	version: string
	description?: string
}

export interface ServerObject {
	url: string
	description?: string
}

export interface TagObject {
	name: string
	description?: string
}

export interface RouteResponse {
	/** Human-readable description (required by OpenAPI). */
	description: string
	/** Response body schema. Omit for empty responses (e.g. 204). */
	schema?: ZodSchema
	/** Media type for the response body. Default: `application/json`. */
	mediaType?: string
}

export interface RouteRequest {
	/** Path parameters — an object schema; each property becomes a `path` parameter (always required). */
	params?: ZodSchema
	/** Query parameters — an object schema; each property becomes a `query` parameter. */
	query?: ZodSchema
	/** Header parameters — an object schema; each property becomes a `header` parameter. */
	headers?: ZodSchema
	/** Request body schema. */
	body?: ZodSchema
	/** Media type for the request body. Default: `application/json`. */
	bodyMediaType?: string
	/** Whether the request body is required. Default: `true`. */
	bodyRequired?: boolean
}

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options'

export interface RouteConfig {
	method: HttpMethod
	/** Path, in Express (`/users/:id`) or OpenAPI (`/users/{id}`) style — both are accepted. */
	path: string
	summary?: string
	description?: string
	operationId?: string
	tags?: string[]
	request?: RouteRequest
	/** Responses keyed by status code (or `default`). At least one is recommended. */
	responses: Record<string | number, RouteResponse>
}

export interface OpenApiDocumentConfig {
	info: OpenApiInfo
	servers?: ServerObject[]
	routes: RouteConfig[]
	/** Merged into the document's `components` (e.g. `securitySchemes`). */
	components?: Record<string, unknown>
	/** Top-level security requirements. */
	security?: Record<string, string[]>[]
	tags?: TagObject[]
}

export interface OpenApiDocument {
	openapi: '3.1.0'
	info: OpenApiInfo
	servers?: ServerObject[]
	paths: Record<string, Record<string, unknown>>
	components?: Record<string, unknown>
	security?: Record<string, string[]>[]
	tags?: TagObject[]
}

type JsonSchema = Record<string, unknown>

interface ParameterObject {
	name: string
	in: 'path' | 'query' | 'header'
	required: boolean
	schema: JsonSchema
}

interface OperationObject {
	summary?: string
	description?: string
	operationId?: string
	tags?: string[]
	parameters?: ParameterObject[]
	requestBody?: unknown
	responses: Record<string, unknown>
}

/** Convert a Zod schema to an OpenAPI-3.1-compatible schema object (draft 2020-12, `$schema` stripped). */
function toSchemaObject(schema: ZodSchema): JsonSchema {
	const json = z.toJSONSchema(schema, { io: 'input' }) as JsonSchema
	// ponytail: drop the JSON-Schema-only `$schema` marker; OpenAPI 3.1 doesn't want it inline.
	delete json['$schema']
	return json
}

/** Split an object schema into individual parameter objects for a given location. */
function parametersFrom(
	schema: ZodSchema | undefined,
	location: 'path' | 'query' | 'header'
): ParameterObject[] {
	if (!schema) return []
	const json = toSchemaObject(schema)
	const properties = json['properties'] as Record<string, JsonSchema> | undefined
	if (json['type'] !== 'object' || !properties) return []
	const required = new Set((json['required'] as string[] | undefined) ?? [])
	return Object.entries(properties).map(([name, propSchema]) => ({
		name,
		in: location,
		// Path parameters are always required in OpenAPI.
		required: location === 'path' ? true : required.has(name),
		schema: propSchema,
	}))
}

/** Convert an Express-style path (`/users/:id`) to OpenAPI style (`/users/{id}`). Already-OpenAPI paths pass through. */
function toOpenApiPath(path: string): string {
	return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}')
}

function buildOperation(route: RouteConfig): OperationObject {
	const parameters = [
		...parametersFrom(route.request?.params, 'path'),
		...parametersFrom(route.request?.query, 'query'),
		...parametersFrom(route.request?.headers, 'header'),
	]

	const responses: Record<string, unknown> = {}
	for (const [status, response] of Object.entries(route.responses)) {
		const responseObject: { description: string; content?: unknown } = {
			description: response.description,
		}
		if (response.schema) {
			responseObject.content = {
				[response.mediaType ?? 'application/json']: { schema: toSchemaObject(response.schema) },
			}
		}
		responses[String(status)] = responseObject
	}

	const operation: OperationObject = { responses }
	if (route.summary) operation.summary = route.summary
	if (route.description) operation.description = route.description
	if (route.operationId) operation.operationId = route.operationId
	if (route.tags?.length) operation.tags = route.tags
	if (parameters.length) operation.parameters = parameters
	if (route.request?.body) {
		operation.requestBody = {
			required: route.request.bodyRequired ?? true,
			content: {
				[route.request.bodyMediaType ?? 'application/json']: {
					schema: toSchemaObject(route.request.body),
				},
			},
		}
	}

	return operation
}

/**
 * Build an OpenAPI 3.1 document from route definitions with Zod request/response schemas.
 *
 * @example
 * ```ts
 * import { z } from 'zod'
 * import { buildOpenApiDocument } from '@rtorcato/api-openapi'
 *
 * const doc = buildOpenApiDocument({
 *   info: { title: 'Users API', version: '1.0.0' },
 *   routes: [
 *     {
 *       method: 'get',
 *       path: '/users/:id',
 *       request: { params: z.object({ id: z.string() }) },
 *       responses: {
 *         200: { description: 'A user', schema: z.object({ id: z.string(), name: z.string() }) },
 *         404: { description: 'Not found' },
 *       },
 *     },
 *   ],
 * })
 * // → serve `doc` as JSON, and render it with `docsHtml({ specUrl })`
 * ```
 */
export function buildOpenApiDocument(config: OpenApiDocumentConfig): OpenApiDocument {
	const paths: Record<string, Record<string, unknown>> = {}
	for (const route of config.routes) {
		const path = toOpenApiPath(route.path)
		paths[path] ??= {}
		paths[path][route.method] = buildOperation(route)
	}

	const doc: OpenApiDocument = {
		openapi: '3.1.0',
		info: config.info,
		paths,
	}
	if (config.servers?.length) doc.servers = config.servers
	if (config.components) doc.components = config.components
	if (config.security?.length) doc.security = config.security
	if (config.tags?.length) doc.tags = config.tags
	return doc
}

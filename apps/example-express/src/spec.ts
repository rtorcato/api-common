export const spec = {
	openapi: '3.0.3',
	info: { title: 'Example Express API', version: '1.0.0' },
	components: {
		schemas: {
			Item: {
				type: 'object',
				required: ['id', 'name'],
				properties: {
					id: { type: 'string', format: 'uuid' },
					name: { type: 'string' },
				},
			},
			// Matches ErrorResponse from @rtorcato/api-response
			Error: {
				type: 'object',
				required: ['error', 'code', 'message'],
				properties: {
					error: { type: 'string', example: 'NotFoundError' },
					code: { type: 'string', example: 'not_found' },
					message: { type: 'string' },
					stack: { type: 'string' },
				},
			},
		},
	},
	paths: {
		'/items': {
			get: {
				summary: 'List items',
				responses: {
					200: {
						description: 'Success',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: { type: 'boolean', example: true },
										data: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
									},
								},
							},
						},
					},
				},
			},
			post: {
				summary: 'Create an item',
				requestBody: {
					required: true,
					content: {
						'application/json': {
							schema: {
								type: 'object',
								required: ['name'],
								properties: { name: { type: 'string', minLength: 1 } },
							},
						},
					},
				},
				responses: {
					201: {
						description: 'Created',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: { type: 'boolean', example: true },
										data: { $ref: '#/components/schemas/Item' },
									},
								},
							},
						},
					},
					400: {
						description: 'Validation error',
						content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
					},
				},
			},
		},
		'/items/{id}': {
			parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
			get: {
				summary: 'Get an item',
				responses: {
					200: {
						description: 'Success',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									properties: {
										success: { type: 'boolean', example: true },
										data: { $ref: '#/components/schemas/Item' },
									},
								},
							},
						},
					},
					404: {
						description: 'Not found',
						content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
					},
				},
			},
			delete: {
				summary: 'Delete an item',
				responses: {
					200: { description: 'Deleted' },
					404: {
						description: 'Not found',
						content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
					},
				},
			},
		},
	},
}

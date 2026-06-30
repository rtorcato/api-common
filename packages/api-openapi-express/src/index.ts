import {
	generateScalarHtml,
	generateSwaggerHtml,
	type ScalarOptions,
	type SwaggerOptions,
} from '@rtorcato/api-openapi'
import { Router } from 'express'

function withSpecRoute(router: Router, spec: object): Router {
	router.get('/openapi.json', (_req, res) => {
		res.json(spec)
	})
	return router
}

export function serveApiDocs(spec: object, options?: ScalarOptions): Router {
	const router = Router()
	const html = generateScalarHtml(spec, options)
	withSpecRoute(router, spec)
	router.get('/', (_req, res) => {
		res.type('html').send(html)
	})
	return router
}

export function serveSwaggerDocs(spec: object, options?: SwaggerOptions): Router {
	const router = Router()
	const html = generateSwaggerHtml(spec, options)
	withSpecRoute(router, spec)
	router.get('/', (_req, res) => {
		res.type('html').send(html)
	})
	return router
}

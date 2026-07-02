import { HttpError } from '@rtorcato/api-errors'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createHttpClient } from './index'

function jsonResponse(body: unknown, status = 200): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	})
}

afterEach(() => {
	vi.restoreAllMocks()
})

describe('createHttpClient', () => {
	it('GETs and parses a JSON body', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: '1', name: 'Ada' }))
		vi.stubGlobal('fetch', fetchMock)

		const api = createHttpClient({ baseURL: 'https://api.example.com' })
		const user = await api.get<{ id: string; name: string }>('/users/me')

		expect(user).toEqual({ id: '1', name: 'Ada' })
		expect(fetchMock.mock.calls[0]?.[0]).toBe('https://api.example.com/users/me')
	})

	it('appends query params and merges headers', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
		vi.stubGlobal('fetch', fetchMock)

		const api = createHttpClient({
			baseURL: 'https://api.example.com',
			headers: { authorization: 'Bearer t' },
		})
		await api.get('/items', {
			query: { page: 2, q: 'hi', skip: undefined },
			headers: { 'x-trace': 'z' },
		})

		const [url, init] = fetchMock.mock.calls[0] ?? []
		expect(url).toBe('https://api.example.com/items?page=2&q=hi')
		expect(init.headers).toMatchObject({ authorization: 'Bearer t', 'x-trace': 'z' })
	})

	it('POSTs a JSON body with content-type', async () => {
		const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }, 201))
		vi.stubGlobal('fetch', fetchMock)

		const api = createHttpClient({ baseURL: 'https://api.example.com' })
		await api.post('/items', { name: 'Widget' })

		const [, init] = fetchMock.mock.calls[0] ?? []
		expect(init.method).toBe('POST')
		expect(init.body).toBe(JSON.stringify({ name: 'Widget' }))
		expect(init.headers['content-type']).toBe('application/json')
	})

	it('throws HttpError with the status and body message on non-2xx', async () => {
		// A fresh Response per call — a body can only be consumed once.
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => jsonResponse({ message: 'no such user' }, 404))
		)

		const api = createHttpClient({ baseURL: 'https://api.example.com' })
		await expect(api.get('/users/x')).rejects.toMatchObject({
			status: 404,
			code: 'http_error',
			message: 'no such user',
		})
		await expect(api.get('/users/x')).rejects.toBeInstanceOf(HttpError)
	})

	it('normalizes a network failure to HttpError(0, network_error)', async () => {
		vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('ECONNREFUSED')))

		const api = createHttpClient({ baseURL: 'https://api.example.com' })
		await expect(api.get('/x')).rejects.toMatchObject({ status: 0, code: 'network_error' })
	})

	it('retries on 5xx then succeeds', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValueOnce(jsonResponse({ error: 'boom' }, 503))
			.mockResolvedValueOnce(jsonResponse({ ok: true }))
		vi.stubGlobal('fetch', fetchMock)

		const api = createHttpClient({
			baseURL: 'https://api.example.com',
			retries: 1,
			retryDelayMs: 0,
		})
		await expect(api.get('/flaky')).resolves.toEqual({ ok: true })
		expect(fetchMock).toHaveBeenCalledTimes(2)
	})

	it('returns undefined for a 204 response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))

		const api = createHttpClient({ baseURL: 'https://api.example.com' })
		await expect(api.delete('/items/1')).resolves.toBeUndefined()
	})
})

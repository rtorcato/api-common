import { HttpError } from '@rtorcato/api-errors'

// ponytail: built on native fetch + AbortSignal.timeout (Node 22) — no axios,
// no wrapper dep. The value this package adds over raw fetch is a configured
// client and normalizing failures into @rtorcato/api-errors HttpError.

export interface HttpClientOptions {
	/** Prepended to every request path. */
	baseURL?: string
	/** Sent on every request (per-request headers merge on top). */
	headers?: Record<string, string>
	/** Per-request timeout in ms. Default: 30_000. */
	timeoutMs?: number
	/** Retry attempts on network error or 5xx. Default: 0 (no retry). */
	retries?: number
	/** Fixed delay between retries in ms. Default: 200. */
	retryDelayMs?: number
}

export interface RequestOptions {
	/** Merged on top of the client's default headers. */
	headers?: Record<string, string>
	/** Appended as a query string; `undefined` values are skipped. */
	query?: Record<string, string | number | boolean | undefined>
	/** Overrides the client timeout for this request. */
	timeoutMs?: number
	/** Caller abort signal — combined with the timeout signal. */
	signal?: AbortSignal
}

export interface HttpClient {
	get<T = unknown>(path: string, options?: RequestOptions): Promise<T>
	delete<T = unknown>(path: string, options?: RequestOptions): Promise<T>
	post<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T>
	put<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T>
	patch<T = unknown>(path: string, body?: unknown, options?: RequestOptions): Promise<T>
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function buildUrl(
	baseURL: string | undefined,
	path: string,
	query?: RequestOptions['query']
): string {
	const url = baseURL
		? new URL(path, baseURL.endsWith('/') ? baseURL : `${baseURL}/`)
		: new URL(path)
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) url.searchParams.set(key, String(value))
		}
	}
	return url.toString()
}

/** Pull a human-readable message out of an error response body (JSON `{message|error}` or raw text). */
function messageFromBody(text: string, statusText: string): string {
	if (!text) return statusText || 'Request failed'
	try {
		const json = JSON.parse(text)
		if (json && typeof json === 'object') {
			const m =
				(json as Record<string, unknown>)['message'] ?? (json as Record<string, unknown>)['error']
			if (typeof m === 'string') return m
		}
	} catch {
		// not JSON — fall through to the raw text
	}
	return text
}

async function parseBody<T>(res: Response): Promise<T> {
	if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T
	const text = await res.text()
	if (!text) return undefined as T
	const contentType = res.headers.get('content-type') ?? ''
	if (contentType.includes('application/json')) return JSON.parse(text) as T
	return text as unknown as T
}

async function request<T>(
	client: HttpClientOptions,
	method: string,
	path: string,
	body: unknown,
	options: RequestOptions = {}
): Promise<T> {
	const url = buildUrl(client.baseURL, path, options.query)
	const headers: Record<string, string> = { ...client.headers, ...options.headers }

	let payload: string | undefined
	if (body !== undefined) {
		payload = JSON.stringify(body)
		headers['content-type'] ??= 'application/json'
	}

	const timeoutMs = options.timeoutMs ?? client.timeoutMs ?? 30_000
	const retries = client.retries ?? 0
	const retryDelayMs = client.retryDelayMs ?? 200

	for (let attempt = 0; ; attempt++) {
		const timeoutSignal = AbortSignal.timeout(timeoutMs)
		const signal = options.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal

		let res: Response
		try {
			res = await fetch(url, { method, headers, body: payload, signal })
		} catch (err) {
			// Network failure or timeout. Retry if attempts remain, else normalize.
			if (attempt < retries) {
				await sleep(retryDelayMs)
				continue
			}
			const message = err instanceof Error ? err.message : 'Network request failed'
			throw new HttpError(0, message, 'network_error')
		}

		if (!res.ok) {
			if (res.status >= 500 && attempt < retries) {
				await sleep(retryDelayMs)
				continue
			}
			const text = await res.text()
			throw new HttpError(res.status, messageFromBody(text, res.statusText), 'http_error')
		}

		return parseBody<T>(res)
	}
}

/**
 * Create a typed HTTP client bound to a base URL and default headers.
 *
 * @example
 * ```ts
 * const api = createHttpClient({ baseURL: 'https://api.example.com', headers: { authorization: `Bearer ${token}` } })
 * const user = await api.get<{ id: string }>('/users/me')
 * await api.post('/users', { name: 'Ada' })
 * ```
 *
 * Non-2xx responses throw an `HttpError` (from `@rtorcato/api-errors`) carrying the
 * status and a message pulled from the response body, so it slots straight into the
 * error-handler middleware. Network failures throw `HttpError` with status `0` and
 * code `network_error`.
 */
export function createHttpClient(clientOptions: HttpClientOptions = {}): HttpClient {
	return {
		get: (path, options) => request(clientOptions, 'GET', path, undefined, options),
		delete: (path, options) => request(clientOptions, 'DELETE', path, undefined, options),
		post: (path, body, options) => request(clientOptions, 'POST', path, body, options),
		put: (path, body, options) => request(clientOptions, 'PUT', path, body, options),
		patch: (path, body, options) => request(clientOptions, 'PATCH', path, body, options),
	}
}

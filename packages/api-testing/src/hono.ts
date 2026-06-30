interface FetchApp {
	fetch: (request: Request, ...extra: any[]) => Response | Promise<Response>
}

export async function honoFetch(
	app: FetchApp,
	path: string,
	init?: RequestInit
): Promise<Response> {
	return app.fetch(new Request(`http://localhost${path}`, init))
}

/** Partial error envelope — pass to `.toMatchObject()` in test assertions. */
export function errorBody(
	code: string,
	extra: Record<string, unknown> = {}
): Record<string, unknown> {
	return { code, ...extra }
}

/** Partial success envelope — pass to `.toMatchObject()` in test assertions. */
export function successBody<T>(data: T): { success: true; data: T } {
	return { success: true, data }
}

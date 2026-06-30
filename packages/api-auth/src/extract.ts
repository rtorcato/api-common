interface TokenSource {
	headers: { authorization?: string }
	cookies?: Record<string, string | undefined>
}

export function findToken(
	req: TokenSource,
	options: { cookieName?: string } = {}
): string | undefined {
	const auth = req.headers.authorization
	if (auth?.startsWith('Bearer ')) return auth.slice(7)
	const name = options.cookieName ?? 'token'
	return req.cookies?.[name]
}

export function findRefreshToken(
	req: { cookies?: Record<string, string | undefined> },
	options: { cookieName?: string } = {}
): string | undefined {
	const name = options.cookieName ?? 'refreshToken'
	return req.cookies?.[name]
}

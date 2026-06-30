# @rtorcato/api-auth

Framework-agnostic JWT sign/verify helpers with Bearer-header and cookie token extraction.

## Install

```sh
pnpm add @rtorcato/api-auth jsonwebtoken
```

## Usage

```ts
import { signToken, verifyToken, findToken, findRefreshToken } from '@rtorcato/api-auth'

// Sign
const token = signToken({ userId: 42 }, process.env.JWT_SECRET, { expiresIn: '1h' })

// Verify (throws UnauthorizedError on failure)
const payload = verifyToken<{ userId: number }>(token, process.env.JWT_SECRET)

// Extract from Bearer header, falling back to 'token' cookie
const raw = findToken(req)  // req: { headers: { authorization? }, cookies? }

// Extract refresh token from 'refreshToken' cookie
const refresh = findRefreshToken(req)
```

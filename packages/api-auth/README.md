# @rtorcato/api-auth

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-auth.svg)](https://www.npmjs.com/package/@rtorcato/api-auth)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-auth.svg)](https://www.npmjs.com/package/@rtorcato/api-auth)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-auth)](https://bundlephobia.com/package/@rtorcato/api-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

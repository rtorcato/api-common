---
title: Installation
description: Install the api-common packages and throw your first typed HTTP error.
---

## Install

Start with the core error classes:

```bash
pnpm add @rtorcato/api-errors
# or: npm install @rtorcato/api-errors
# or: yarn add @rtorcato/api-errors
```

Then add the adapter for your framework (the framework itself is a peer dependency):

```bash
# Express
pnpm add @rtorcato/api-errors-express express

# Hono
pnpm add @rtorcato/api-errors-hono hono
```

All packages are **ESM-only**. Your `package.json` should have `"type": "module"`,
and your `tsconfig.json` should use `"module": "nodenext"` (or `"esnext"`).

## Requirements

- **Node.js**: ≥22.
- **TypeScript**: any recent version. Types ship with each package.
- **Framework**: `express` `^4.18 || ^5` for the Express adapter, `hono` `^4` for the Hono adapter.

## Throw your first error

`@rtorcato/api-errors` works on its own — anywhere, no framework needed. Each class
extends `HttpError` and carries a `status` and a machine-readable `code`:

```ts
import { NotFoundError, BadRequestError } from '@rtorcato/api-errors'

function getUser(id: string) {
	if (!id) throw new BadRequestError('id is required')
	const user = db.find(id)
	if (!user) throw new NotFoundError('User not found')
	return user
}
```

| Class | Status | Default `code` |
|---|---|---|
| `BadRequestError` | 400 | `bad_request` |
| `UnauthorizedError` | 401 | `unauthorized` |
| `ForbiddenError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `InternalServerError` | 500 | `internal_server_error` |

The base `HttpError` takes a custom status: `new HttpError(418, "I'm a teapot", 'teapot')`.
Both `message` and `code` are overridable on every subclass.

## Wire it into a framework

Throwing the errors is half the story — the adapters turn them into HTTP responses.
Continue with the [Express guide](./express.md) or the [Hono guide](./hono.md).

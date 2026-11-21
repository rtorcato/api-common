---
title: Installation
description: Install @rtorcato/api-common and throw your first typed HTTP error.
---

## Install

Install the package once:

```bash
pnpm add @rtorcato/api-common
# or: npm install @rtorcato/api-common
# or: yarn add @rtorcato/api-common
```

Then add the third-party libraries for the subpaths you use. They are optional peer dependencies, so you control the versions:

```bash
# Express
pnpm add express zod

# Hono
pnpm add hono zod
```

The [optional peers](./optional-peers.md) page lists what each subpath needs. Coming from the old `@rtorcato/api-*` packages? Read [Migrating](./migration.md).

The package is **ESM-only** and has **no root export**, so you always import from a subpath such as `@rtorcato/api-common/errors`. Your `package.json` should have `"type": "module"`, and your `tsconfig.json` should use `"module": "nodenext"` (or `"esnext"`).

## Requirements

- **Node.js**: 24 or newer.
- **TypeScript**: any recent version. Types ship with the package.
- **Framework**: `express` `^4.18 || ^5` for the Express adapters, `hono` `^4` for the Hono adapters.

## Throw your first error

The `@rtorcato/api-common/errors` subpath works on its own — anywhere, no framework needed. Each class
extends `HttpError` and carries a `status` and a machine-readable `code`:

```ts
import { NotFoundError, BadRequestError } from '@rtorcato/api-common/errors'

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

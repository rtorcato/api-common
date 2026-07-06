# @rtorcato/api-errors

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-errors.svg)](https://www.npmjs.com/package/@rtorcato/api-errors)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-errors.svg)](https://www.npmjs.com/package/@rtorcato/api-errors)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-errors)](https://bundlephobia.com/package/@rtorcato/api-errors)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic HTTP error classes for Node.js APIs.

## Install

```sh
pnpm add @rtorcato/api-errors
```

## Usage

```ts
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  HttpError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from '@rtorcato/api-errors'

throw new NotFoundError('User not found', 'user_not_found')
// err.status  -> 404
// err.code    -> 'user_not_found'
// err.message -> 'User not found'
```

Every class extends `HttpError`, which extends `Error`. Each carries:

- `status` — HTTP status code (`number`)
- `code` — machine-readable error code (`string`)
- `message` — human-readable message (inherited from `Error`)

### Available classes

| Class | Status | Default code |
| --- | --- | --- |
| `BadRequestError` | 400 | `bad_request` |
| `UnauthorizedError` | 401 | `unauthorized` |
| `ForbiddenError` | 403 | `forbidden` |
| `NotFoundError` | 404 | `not_found` |
| `ConflictError` | 409 | `conflict` |
| `InternalServerError` | 500 | `internal_server_error` |

`HttpError` itself is also exported for custom statuses:

```ts
throw new HttpError(429, 'Too many requests', 'rate_limited')
```

## Related

- [`@rtorcato/api-errors-express`](https://www.npmjs.com/package/@rtorcato/api-errors-express) — Express middleware adapter
- [`@rtorcato/api-errors-hono`](https://www.npmjs.com/package/@rtorcato/api-errors-hono) — Hono middleware adapter

Source + changelog: https://github.com/rtorcato/api-common/tree/main/packages/api-errors

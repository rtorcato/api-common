---
title: api-response
description: Consistent success-response envelope for JSON APIs.
---

`@rtorcato/api-response` provides a single `ok()` helper that wraps your data in a consistent `{ success: true, data }` envelope — the counterpart to the error shape produced by `api-errors`.

## Install

```bash
pnpm add @rtorcato/api-response
```

## Usage

```ts
import { ok } from '@rtorcato/api-response'

// Express
res.json(ok(user))
res.status(201).json(ok(item))

// Hono
return c.json(ok(items))
return c.json(ok(item), 201)
```

## Response shape

```json
{ "success": true, "data": { "id": "1", "name": "hello" } }
```

With an optional message:

```ts
ok(item, 'Item created successfully')
// → { "success": true, "data": { ... }, "message": "Item created successfully" }
```

## Zod schemas for OpenAPI / testing

`successSchema` and `errorSchema` build zod schemas for the response envelopes — useful for OpenAPI contracts and test assertions.

```ts
import { successSchema, errorSchema } from '@rtorcato/api-response'
import { z } from 'zod'

const itemSchema = z.object({ id: z.string(), name: z.string() })

// For a success response containing an item
const responseSchema = successSchema(itemSchema)

// For error responses
const errSchema = errorSchema()
```

These pair with the [OpenAPI spec helpers](../examples/express.md) in the example apps.

## Full response contract

| Field | Success | Error |
|-------|---------|-------|
| `success` | `true` | _(absent — error handlers don't set it)_ |
| `data` | payload | — |
| `message` | optional | human-readable error message |
| `error` | — | error class name |
| `code` | — | machine-readable code |

---
title: api-validation
description: Zod request validation that throws a BadRequestError on failure.
---

`@rtorcato/api-validation` parses incoming data with a zod schema and throws a `BadRequestError` on failure — which the error-handler middleware converts to a 400 JSON response automatically.

## Install

```bash
pnpm add @rtorcato/api-validation
```

## Usage

```ts
import { validate } from '@rtorcato/api-validation'
import { z } from 'zod'

const createItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
})

// Express
app.post('/items', (req, res) => {
  const body = validate(createItemSchema, req.body)
  // body is typed: { name: string; quantity: number }
  // ...
})

// Hono
app.post('/items', async (c) => {
  const body = validate(createItemSchema, await c.req.json())
  // ...
})
```

On failure, `validate` throws a `BadRequestError` with a formatted message:

```json
{
  "error": "BadRequestError",
  "code": "validation_error",
  "message": "Error #1: Required at name; Error #2: Expected number, received nan at quantity"
}
```

## What it does

`validate(schema, data)` is a thin wrapper:

1. Calls `schema.safeParse(data)`
2. On success → returns the typed result
3. On failure → formats the `ZodError` into a readable string and throws `new BadRequestError(message, 'validation_error')`

The `BadRequestError` is caught by `errorHandler()` from `api-errors-express` or `api-errors-hono` and converted to a 400 response.

## Format errors without throwing

If you need the formatted error string without throwing:

```ts
import { formatZodError } from '@rtorcato/api-validation'

const result = schema.safeParse(data)
if (!result.success) {
  const message = formatZodError(result.error)
  // handle however you like
}
```

## Validate route params / query strings

`validate` works on any data, not just request bodies:

```ts
const paramsSchema = z.object({ id: z.string().uuid() })

app.get('/items/:id', (req, res) => {
  const { id } = validate(paramsSchema, req.params)
  // ...
})
```

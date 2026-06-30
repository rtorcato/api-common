---
title: Testing your API
description: How to test Express and Hono routes that use api-common packages.
---

Both example apps use [Vitest](https://vitest.dev). The patterns below work with any test runner that supports async/await.

## Express — supertest

```bash
pnpm add -D supertest @types/supertest
```

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import express from 'express'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-express'
import { NotFoundError } from '@rtorcato/api-errors'
import { ok } from '@rtorcato/api-response'

const app = express()
app.use(express.json())

app.get('/items/:id', (req, res) => {
  if (req.params.id !== '1') throw new NotFoundError(`Item ${req.params.id} not found`)
  res.json(ok({ id: '1', name: 'hello' }))
})

app.use(notFoundHandler)
app.use(errorHandler())

describe('GET /items/:id', () => {
  it('returns the item', async () => {
    const res = await request(app).get('/items/1')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ success: true, data: { id: '1', name: 'hello' } })
  })

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/items/bad')
    expect(res.status).toBe(404)
    expect(res.body.code).toBe('not_found')
    expect(res.body.message).toContain('bad')
  })
})
```

## Hono — app.request()

Hono ships a built-in test helper — no extra package needed.

```ts
import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { errorHandler, notFoundHandler } from '@rtorcato/api-errors-hono'
import { NotFoundError } from '@rtorcato/api-errors'
import { ok } from '@rtorcato/api-response'

const app = new Hono()

app.get('/items/:id', (c) => {
  if (c.req.param('id') !== '1') throw new NotFoundError(`Item not found`)
  return c.json(ok({ id: '1', name: 'hello' }))
})

app.notFound(notFoundHandler)
app.onError(errorHandler())

describe('GET /items/:id', () => {
  it('returns the item', async () => {
    const res = await app.request('/items/1')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ success: true, data: { id: '1', name: 'hello' } })
  })

  it('returns 404 for unknown id', async () => {
    const res = await app.request('/items/bad')
    const body = await res.json()
    expect(res.status).toBe(404)
    expect(body.code).toBe('not_found')
  })
})
```

## Asserting the standard shapes

```ts
// Success response
expect(res.body.success).toBe(true)
expect(res.body.data).toBeDefined()

// Error response
expect(res.body.code).toBe('not_found')       // machine-readable, stable
expect(res.body.error).toBe('NotFoundError')  // class name
expect(typeof res.body.message).toBe('string')
```

Switch on `code` in your assertions — it's intentionally stable. `error` (the class name) and `message` can vary.

## Validation errors

```ts
it('returns 400 when body is invalid', async () => {
  const res = await request(app)
    .post('/items')
    .send({})  // missing required fields
  expect(res.status).toBe(400)
  expect(res.body.code).toBe('validation_error')
})
```

## Rate limiter in tests

`createRateLimiter()` exposes a `reset()` method — call it in `beforeEach` to avoid test bleed:

```ts
import { limiter } from '../src/limiter.js'

beforeEach(() => limiter.reset())
```

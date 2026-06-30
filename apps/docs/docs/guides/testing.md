---
title: Testing your API
description: How to test Express and Hono routes using @rtorcato/api-testing.
---

The `@rtorcato/api-testing` package bundles everything you need to test routes built on api-common: a supertest re-export, a Hono fetch helper, response-shape matchers, and JWT helpers for auth flows.

```bash
pnpm add -D @rtorcato/api-testing
```

## Make your app testable

Extract your app factory into a separate file so each test gets a clean instance.

```ts
// src/app.ts
export function createApp() {
  // wire up routes, middleware, error handlers
  return app
}
```

```ts
// src/index.ts (entry point, not imported by tests)
import { createApp } from './app.js'
const app = createApp()
app.listen(3000)
```

## Express

`@rtorcato/api-testing` re-exports `supertest` so you don't need a separate install.

```ts
import { supertest, successBody, errorBody } from '@rtorcato/api-testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API', () => {
  let req: ReturnType<typeof supertest>

  beforeEach(() => {
    req = supertest(createApp())
  })

  it('returns empty list', async () => {
    const res = await req.get('/items')
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject(successBody([]))
  })

  it('creates an item', async () => {
    const res = await req.post('/items').send({ name: 'Widget' })
    expect(res.status).toBe(201)
    expect(res.body).toMatchObject(successBody({ name: 'Widget' }))
  })

  it('rejects invalid body', async () => {
    const res = await req.post('/items').send({ name: '' })
    expect(res.status).toBe(400)
    expect(res.body).toMatchObject(errorBody('validation_error'))
  })

  it('returns 404 for missing item', async () => {
    const res = await req.get('/items/nonexistent')
    expect(res.status).toBe(404)
    expect(res.body).toMatchObject(errorBody('not_found'))
  })
})
```

## Hono

Hono apps expose a `fetch` handler — no HTTP server needed. Use `honoFetch` to call it directly.

```ts
import { honoFetch, successBody, errorBody } from '@rtorcato/api-testing'
import { describe, expect, it } from 'vitest'
import { createApp } from './app.js'

describe('items API', () => {
  it('returns empty list', async () => {
    const res = await honoFetch(createApp(), '/items')
    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject(successBody([]))
  })

  it('creates an item', async () => {
    const res = await honoFetch(createApp(), '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Widget' }),
    })
    expect(res.status).toBe(201)
    expect(await res.json()).toMatchObject(successBody({ name: 'Widget' }))
  })

  it('rejects invalid body', async () => {
    const res = await honoFetch(createApp(), '/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    })
    expect(res.status).toBe(400)
    expect(await res.json()).toMatchObject(errorBody('validation_error'))
  })
})
```

## Response matchers

`successBody` and `errorBody` return partial objects for use with `.toMatchObject()` — they assert shape without locking in every field.

```ts
// asserts { success: true, data: { name: 'Widget' } }
expect(res.body).toMatchObject(successBody({ name: 'Widget' }))

// asserts { code: 'not_found' }
expect(res.body).toMatchObject(errorBody('not_found'))

// assert extra fields alongside the code
expect(res.body).toMatchObject(errorBody('validation_error', { message: /required/ }))
```

Assert on `code` — it's the stable, machine-readable field. Avoid asserting `error` (class name) or `message` (human string), which can change.

## Auth helpers

When testing protected routes that use `@rtorcato/api-auth`, use the built-in JWT helpers instead of crafting tokens by hand.

```ts
import { supertest, testToken, bearerHeader, TEST_JWT_SECRET } from '@rtorcato/api-testing'
import { createApp } from './app.js'

// createApp() must accept the same secret your middleware uses
const req = supertest(createApp({ jwtSecret: TEST_JWT_SECRET }))

it('returns 401 without a token', async () => {
  const res = await req.get('/me')
  expect(res.status).toBe(401)
})

it('returns 200 with a valid token', async () => {
  const res = await req.get('/me').set(bearerHeader(testToken({ userId: 42 })))
  expect(res.status).toBe(200)
})
```

| Export | Purpose |
|--------|---------|
| `TEST_JWT_SECRET` | Constant secret string — use it in both your app factory and your tests |
| `testToken(payload?, options?)` | Signs a JWT with `TEST_JWT_SECRET` |
| `bearerHeader(token)` | Returns `{ Authorization: 'Bearer <token>' }` for use with `.set()` |

## Rate limiter in tests

`createRateLimiter()` exposes a `reset()` method. Call it in `beforeEach` to avoid bleed between tests:

```ts
import { limiter } from '../src/limiter.js'

beforeEach(() => limiter.reset())
```

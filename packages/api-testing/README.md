# @rtorcato/api-testing

Test helpers for API projects: supertest re-export, JWT auth fixtures, and response assertion matchers.

## Install

```sh
pnpm add -D @rtorcato/api-testing
```

## Usage

```ts
import { supertest, testToken, bearerHeader, errorBody, successBody, honoFetch } from '@rtorcato/api-testing'

// Express — supertest is re-exported
const res = await supertest(app).get('/me').set(bearerHeader(testToken({ userId: 42 })))
expect(res.status).toBe(200)
expect(res.body).toMatchObject(successBody({ id: 42 }))

// Error assertion
expect(res.body).toMatchObject(errorBody('not_found'))

// Hono — fetch-based testing
const res = await honoFetch(app, '/hello', { method: 'GET' })
```

`testToken(payload?, options?)` signs with `TEST_JWT_SECRET` — use the same constant in `authMiddleware` during tests.

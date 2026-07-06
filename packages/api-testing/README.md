# @rtorcato/api-testing

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-testing.svg)](https://www.npmjs.com/package/@rtorcato/api-testing)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-testing.svg)](https://www.npmjs.com/package/@rtorcato/api-testing)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-testing)](https://bundlephobia.com/package/@rtorcato/api-testing)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

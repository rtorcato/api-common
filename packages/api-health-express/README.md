# @rtorcato/api-health-express

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-health-express.svg)](https://www.npmjs.com/package/@rtorcato/api-health-express)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-health-express.svg)](https://www.npmjs.com/package/@rtorcato/api-health-express)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-health-express)](https://bundlephobia.com/package/@rtorcato/api-health-express)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Express liveness/readiness probe handlers for
[`@rtorcato/api-health`](https://www.npmjs.com/package/@rtorcato/api-health).

## Install

```bash
pnpm add @rtorcato/api-health @rtorcato/api-health-express
```

## Usage

```ts
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-express'

const health = createHealthRegistry()
health.register('db', async () => {
  await db.query('SELECT 1')
})

app.get('/healthz', livenessHandler()) // always 200
app.get('/readyz', readinessHandler(health)) // 200 all-pass, 503 any-fail
```

- `livenessHandler()` — always responds `200 { status: 'healthy' }`; runs no
  checks.
- `readinessHandler(registry)` — runs the registry's checks and responds `200`
  when all pass or `503` when any fail, with the full report as the body.

See the [api-health guide](https://github.com/rtorcato/api-common/blob/main/apps/docs/docs/guides/api-health.md)
for registering checks and the liveness-vs-readiness rationale.

## License

MIT

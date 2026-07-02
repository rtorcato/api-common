---
title: api-health-express
description: Express liveness/readiness probe handlers for @rtorcato/api-health.
---

`@rtorcato/api-health-express` provides ready-made Express handlers for liveness and readiness probes, backed by an [`@rtorcato/api-health`](./api-health.md) registry.

## Install

```bash
pnpm add @rtorcato/api-health @rtorcato/api-health-express
```

## Usage

```ts
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-express'

const health = createHealthRegistry()
health.register('db', async () => { await db.query('SELECT 1') })

app.get('/healthz', livenessHandler())   // always 200
app.get('/readyz', readinessHandler(health)) // 200 all-pass, 503 any-fail
```

- `livenessHandler()` — always responds `200 { status: 'healthy' }`; runs no checks.
- `readinessHandler(registry)` — runs the registry's checks and responds `200` when all pass or `503` when any fail, with the full report as the body.

See the [api-health guide](./api-health.md) for registering checks and the liveness-vs-readiness rationale.

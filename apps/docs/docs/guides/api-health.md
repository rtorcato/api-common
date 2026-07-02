---
title: api-health
description: Framework-agnostic liveness/readiness health-check registry with Express and Hono adapters.
---

`@rtorcato/api-health` is a framework-agnostic registry of readiness checks. Register checks (DB pings, broker connections, …), then run them from a probe endpoint — or drop in the Express or Hono adapter for ready-made `/healthz` and `/readyz` handlers.

## Install

```bash
# Core (agnostic)
pnpm add @rtorcato/api-health

# Framework adapters (pick one or both)
pnpm add @rtorcato/api-health-express
pnpm add @rtorcato/api-health-hono
```

## Liveness vs readiness

- **Liveness** (`/healthz`) — "is the process up?" Always `200`. Answering at all proves the event loop is responsive. Runs no dependency checks, so a slow database never fails liveness (which would trigger a needless restart).
- **Readiness** (`/readyz`) — "can I serve traffic?" Runs every registered check. `200` when all pass, `503` when any fail, with a per-check report as the body.

## Registering checks

```ts
import { createHealthRegistry } from '@rtorcato/api-health'

const health = createHealthRegistry()

// A check reports healthy by returning/resolving, unhealthy by throwing.
health.register('db', async () => {
  await db.query('SELECT 1')
})
health.register('broker', () => {
  if (!amqp.isConnected) throw new Error('disconnected')
})

const report = await health.run()
// { status: 'unhealthy', checks: { db: { status: 'healthy' }, broker: { status: 'unhealthy', error: 'disconnected' } } }
```

Re-registering the same name replaces the previous check — handy for wiring a check only after its dependency connects.

## Express adapter

```ts
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-express'

const health = createHealthRegistry()
health.register('db', async () => { await db.query('SELECT 1') })

app.get('/healthz', livenessHandler())
app.get('/readyz', readinessHandler(health))
```

## Hono adapter

```ts
import { createHealthRegistry } from '@rtorcato/api-health'
import { livenessHandler, readinessHandler } from '@rtorcato/api-health-hono'

const health = createHealthRegistry()
health.register('db', async () => { await db.query('SELECT 1') })

app.get('/healthz', livenessHandler())
app.get('/readyz', readinessHandler(health))
```

## Notes

- Checks run **concurrently** on each `run()`.
- There is **no per-check timeout** — a hung check hangs the readiness response until the caller's probe timeout (e.g. Kubernetes `readinessProbe.timeoutSeconds`) fires. Wrap a check in your own timeout race if you need it to fail fast.

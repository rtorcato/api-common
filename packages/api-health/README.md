# @rtorcato/api-health

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-health.svg)](https://www.npmjs.com/package/@rtorcato/api-health)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-health.svg)](https://www.npmjs.com/package/@rtorcato/api-health)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-health)](https://bundlephobia.com/package/@rtorcato/api-health)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic liveness/readiness health-check registry for Node API
projects. Register readiness checks (DB pings, broker connections, …) and run
them from a probe endpoint — or drop in the Express or Hono adapter for
ready-made `/healthz` and `/readyz` handlers.

## Install

```bash
pnpm add @rtorcato/api-health
```

## Usage

```ts
import { createHealthRegistry } from '@rtorcato/api-health'

const health = createHealthRegistry()

// A check reports healthy by returning/resolving, unhealthy by throwing.
health.register('db', async () => {
  await db.query('SELECT 1')
})

const report = await health.run()
// { status: 'unhealthy', checks: { db: { status: 'healthy' }, ... } }
```

- **Liveness** — "is the process up?" Always `200`; runs no checks, so a slow
  dependency never triggers a needless restart.
- **Readiness** — "can I serve traffic?" Runs every registered check; `200` when
  all pass, `503` when any fail, with a per-check report as the body.

Checks run **concurrently** on each `run()`, and there is **no per-check
timeout** — wrap a check in your own timeout race if it must fail fast.

## Framework adapters

- [`@rtorcato/api-health-express`](https://www.npmjs.com/package/@rtorcato/api-health-express)
- [`@rtorcato/api-health-hono`](https://www.npmjs.com/package/@rtorcato/api-health-hono)

Full guide: [api-health](https://github.com/rtorcato/api-common/blob/main/apps/docs/docs/guides/api-health.md).

## License

MIT

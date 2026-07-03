# @rtorcato/api-graceful-shutdown

## 0.2.0

### Minor Changes

- 7a51835: 1.0 surface hygiene (from the #88 API-freeze audit)

  - **api-upload:** rename `uploader()` → `uploadFile()` so the action reads as a verb, consistent with `validate`/`connect`/`createX` across the packages. **Breaking:** update imports (`import { uploadFile } from '@rtorcato/api-upload'`).
  - **api-graceful-shutdown:** rename `createShutdownHandler()` → `createShutdownController()` so the factory matches its return type `ShutdownController` (mirrors `createHealthRegistry → HealthRegistry`). **Breaking:** update imports.
  - **api-openapi:** replace `export * from './builder'` with explicit named re-exports so the public surface is enumerated and can't silently widen/narrow. No symbols added or removed.
  - **api-amqp:** type `connect(url, socketOptions?)`'s second parameter against amqplib (`Parameters<typeof amqp.connect>[1]`) instead of `unknown`.

## 0.1.0

### Minor Changes

- f2332f7: Add `@rtorcato/api-graceful-shutdown`: SIGTERM/SIGINT drain for Node API servers. `createShutdownHandler` runs ordered cleanup hooks with a hard timeout and force-exit; `closeHttpServer` wraps a Node HTTP server's `close()` as a hook (works for Express and Hono via `@hono/node-server`).

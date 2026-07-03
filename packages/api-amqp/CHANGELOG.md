# @rtorcato/api-amqp

## 0.2.1

### Patch Changes

- 7a51835: 1.0 surface hygiene (from the #88 API-freeze audit)

  - **api-upload:** rename `uploader()` → `uploadFile()` so the action reads as a verb, consistent with `validate`/`connect`/`createX` across the packages. **Breaking:** update imports (`import { uploadFile } from '@rtorcato/api-upload'`).
  - **api-graceful-shutdown:** rename `createShutdownHandler()` → `createShutdownController()` so the factory matches its return type `ShutdownController` (mirrors `createHealthRegistry → HealthRegistry`). **Breaking:** update imports.
  - **api-openapi:** replace `export * from './builder'` with explicit named re-exports so the public surface is enumerated and can't silently widen/narrow. No symbols added or removed.
  - **api-amqp:** type `connect(url, socketOptions?)`'s second parameter against amqplib (`Parameters<typeof amqp.connect>[1]`) instead of `unknown`.

## 0.2.0

### Minor Changes

- d8e4a95: Add `@rtorcato/api-amqp` — typed amqplib publisher/consumer helpers for RabbitMQ. `createPublisher` asserts an exchange and JSON-encodes messages; `createConsumer` asserts a queue, sets prefetch, and acks on success / nacks on throw. `amqplib` is a peer dependency.

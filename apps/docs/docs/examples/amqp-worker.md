---
title: AMQP worker example
description: Long-running RabbitMQ worker wiring api-amqp and graceful shutdown together.
---

The `apps/example-amqp-worker` directory contains a long-running RabbitMQ
**worker** — the only non-HTTP example in this repo. It publishes and consumes
messages on the same broker via
[`@rtorcato/api-amqp`](https://github.com/rtorcato/api-common/tree/main/packages/api-amqp),
and drains cleanly on `SIGTERM` / `SIGINT` via
[`@rtorcato/api-graceful-shutdown`](https://github.com/rtorcato/api-common/tree/main/packages/api-graceful-shutdown).

On startup it opens one connection + channel, asserts a `demo` topic exchange,
binds a `demo.work` queue to it (pattern `demo.#`), and starts a consumer that
logs every message it receives. A timer then publishes a `demo.created` message
every few seconds — so the worker is both producer and consumer, and you can
watch messages flow through the broker in its logs.

## What it demonstrates

| Package | Usage in the example |
|---|---|
| [`api-amqp`](https://github.com/rtorcato/api-common/tree/main/packages/api-amqp) | `connect` opens a connection + channel; `createPublisher` asserts the exchange and JSON-encodes; `createConsumer` asserts the queue and acks on success / nacks on throw |
| [`api-config`](https://github.com/rtorcato/api-common/tree/main/packages/api-config) | `loadEnv()` validates `AMQP_URL` + `LOG_LEVEL` from `.env` at startup |
| [`api-logger`](https://github.com/rtorcato/api-common/tree/main/packages/api-logger) | `createLogger()` gives a pino logger, pretty-printed in dev |
| [`api-graceful-shutdown`](https://github.com/rtorcato/api-common/tree/main/packages/api-graceful-shutdown) | `createShutdownController` clears the timer and closes the channel then the connection on shutdown |

`createConsumer` asserts the queue but does **not** bind it to the exchange, so
the worker binds `demo.work` → `demo` itself (`src/worker.ts`).

## Run with Docker

```bash
cd apps/example-amqp-worker
docker compose up
```

`docker compose up` brings up RabbitMQ (`rabbitmq:3-management`) and the worker
together. The worker connects to `amqp://rabbitmq:5672`; watch its logs for
published / received messages.

- Management UI → `http://localhost:15672` (guest / guest) — inspect the `demo`
  exchange, the `demo.work` queue, and live message rates.

## Run locally

```bash
cd apps/example-amqp-worker
cp .env.example .env
# point AMQP_URL at a running broker (defaults to amqp://localhost)
pnpm dev
```

## Test

```bash
cd apps/example-amqp-worker
pnpm test
```

The worker test runs **broker-free**: it drives `createWorker` against a fake
channel object (`src/worker.test.ts`) — no RabbitMQ, no network — asserting the
exchange/queue/binding setup, that `publish` emits a JSON buffer, and that a
delivered message is logged and acked.

## Source

[`apps/example-amqp-worker/src/worker.ts`](https://github.com/rtorcato/api-common/tree/main/apps/example-amqp-worker/src/worker.ts)

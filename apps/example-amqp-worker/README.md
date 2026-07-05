# example-amqp-worker

A long-running RabbitMQ **worker** — the only non-HTTP example in this repo. It
publishes and consumes messages on the same broker via `@rtorcato/api-amqp`, and
drains cleanly on `SIGTERM`/`SIGINT` via `@rtorcato/api-graceful-shutdown`.

On startup it opens one connection + channel, asserts a `demo` topic exchange,
binds a `demo.work` queue to it (pattern `demo.#`), and starts a consumer that
logs every message it receives. A timer then publishes a `demo.created` message
every few seconds — so the worker is both producer and consumer, and you can
watch messages flow through the broker in its logs.

## What it shows

| Package | Usage |
|---|---|
| `api-amqp` | `connect` to open a connection + channel; `createPublisher` (asserts the exchange, JSON-encodes) and `createConsumer` (asserts the queue, acks on success / nacks on throw) |
| `api-config` | Load `AMQP_URL` + `LOG_LEVEL` from `.env` with Zod validation |
| `api-logger` | Pino logger, pretty-printed in dev |
| `api-graceful-shutdown` | `createShutdownController` to clear the timer and close the channel then the connection on shutdown |

`createConsumer` asserts the queue but does **not** bind it to the exchange, so
the worker binds `demo.work` → `demo` itself (`src/worker.ts`).

## Run with Docker

```bash
docker compose up
# RabbitMQ + the worker start together; watch the worker logs for published/received messages
# → management UI at http://localhost:15672  (guest / guest)
```

`docker compose up` brings up RabbitMQ (`rabbitmq:3-management`) and the worker
together. The worker connects to `amqp://rabbitmq:5672`; the management UI lets
you inspect the `demo` exchange, the `demo.work` queue, and live message rates.

## Run locally

```bash
cp .env.example .env
# point AMQP_URL at a running broker (defaults to amqp://localhost)
pnpm dev
```

## Test

```bash
pnpm test
```

The worker test runs **broker-free**: it drives `createWorker` against a fake
channel object (`src/worker.test.ts`) — no RabbitMQ, no network — asserting the
exchange/queue/binding setup, that `publish` emits a JSON buffer, and that a
delivered message is logged and acked.

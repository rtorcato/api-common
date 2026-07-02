---
title: api-amqp
description: Typed amqplib publisher/consumer helpers for RabbitMQ.
---

`@rtorcato/api-amqp` wraps [amqplib](https://github.com/amqp-node/amqplib) with
small typed helpers: JSON encoding, exchange/queue assertion, and
ack-on-success / nack-on-throw. The publisher and consumer take an amqplib
`Channel`, so they compose with a shared connection and test without a broker.

## Install

```bash
pnpm add @rtorcato/api-amqp amqplib
```

`amqplib` is a peer dependency — you bring your own version.

## Usage

```ts
import { connect, createPublisher, createConsumer } from '@rtorcato/api-amqp'

const { connection, channel } = await connect('amqp://localhost')

const publish = await createPublisher<{ id: string }>(channel, { exchange: 'orders' })
publish('order.created', { id: '1' })

await createConsumer<{ id: string }>(channel, { queue: 'orders' }, async (order) => {
  await process(order)
})
```

`connect` returns `{ connection, channel }` — close the channel then the
connection on shutdown.

## Behaviour

- **Publisher** — `{ exchange, exchangeType?, durable? }`. `exchangeType` defaults
  to `'topic'`, `durable` to `true`. Messages are published `persistent` with
  `content-type: application/json`.
- **Consumer** — `{ queue, durable?, prefetch?, requeueOnError? }`. `prefetch`
  defaults to `10`. The message is acked when the handler resolves and nacked
  when it throws; set `requeueOnError: true` to requeue (watch for
  poison-message loops).

## Reconnection

Not included — amqplib doesn't reconnect on its own. For production resilience
wrap `connect` in a retry loop or use
[`amqp-connection-manager`](https://github.com/jwalton/node-amqp-connection-manager)
and pass its channel to these helpers.

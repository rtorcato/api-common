# @rtorcato/api-amqp

Typed [amqplib](https://github.com/amqp-node/amqplib) publisher/consumer helpers for RabbitMQ — JSON encoding, exchange/queue assertion, and ack-on-success / nack-on-throw.

## Install

```sh
pnpm add @rtorcato/api-amqp amqplib
```

`amqplib` is a peer dependency — you bring your own version (and often a shared connection).

## Usage

```ts
import { connect, createPublisher, createConsumer } from '@rtorcato/api-amqp'

const { connection, channel } = await connect('amqp://localhost')

// Publisher — asserts the exchange, then JSON-encodes each message
const publish = await createPublisher<{ id: string }>(channel, { exchange: 'orders' })
publish('order.created', { id: '1' })

// Consumer — asserts the queue, acks on success, nacks when the handler throws
await createConsumer<{ id: string }>(channel, { queue: 'orders' }, async (order) => {
  await process(order)
})
```

`connect` returns `{ connection, channel }`; close the channel then the connection on shutdown. The publisher/consumer helpers also accept a channel you created yourself (e.g. a shared one).

## Options

- **Publisher:** `{ exchange, exchangeType?, durable? }` — `exchangeType` defaults to `'topic'`, `durable` to `true`. Messages are published `persistent` with `content-type: application/json`.
- **Consumer:** `{ queue, durable?, prefetch?, requeueOnError? }` — `prefetch` defaults to `10`. On handler throw the message is nacked; set `requeueOnError: true` to requeue (beware poison-message loops).

## Reconnection

Not included — amqplib does not reconnect on its own. For production resilience, wrap `connect` in a retry loop or use [`amqp-connection-manager`](https://github.com/jwalton/node-amqp-connection-manager) and pass its channel to these helpers.

Source: https://github.com/rtorcato/api-common/tree/main/packages/api-amqp

---
'@rtorcato/api-amqp': minor
---

Add `@rtorcato/api-amqp` — typed amqplib publisher/consumer helpers for RabbitMQ. `createPublisher` asserts an exchange and JSON-encodes messages; `createConsumer` asserts a queue, sets prefetch, and acks on success / nacks on throw. `amqplib` is a peer dependency.

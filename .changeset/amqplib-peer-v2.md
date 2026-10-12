---
"@rtorcato/api-amqp": minor
---

Accept amqplib 2.x: the `amqplib` peer range is now `^0.10.0 || ^2.0.0`, so 2.x consumers no longer get a peer-dependency warning. The `@types/amqplib` devDependency is gone, since amqplib ships its own types. The one API break in 2.x (`heartbeat: 0`) isn't used by api-amqp.

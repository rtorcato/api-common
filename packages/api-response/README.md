# @rtorcato/api-response

Consistent success-response envelope for Node API projects. Pairs with
`@rtorcato/api-errors` — success bodies carry `success: true` + `data`, error
bodies carry `status`/`code`/`message`.

```ts
import { ok } from '@rtorcato/api-response'

res.json(ok(user)) // { success: true, data: user }
res.json(ok(user, 'created')) // { success: true, data: user, message: 'created' }
```

## API

### `ok(data, message?)`

Builds a `SuccessResponse<T>` — `{ success: true, data, message? }`. `message`
is omitted from the object when not passed.

### `successSchema(dataSchema)`

Returns a zod schema for the envelope wrapping `dataSchema`, for documenting or
validating responses (e.g. in OpenAPI contracts).

```ts
import { successSchema } from '@rtorcato/api-response'
import { z } from 'zod'

const UserResponse = successSchema(z.object({ id: z.number() }))
// { success: true, data: { id: number }, message?: string }
```

## Peer dependencies

`zod ^3.23`.

## License

MIT

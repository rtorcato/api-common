# @rtorcato/api-validation

Zod request validation helpers with pretty error formatting. Pairs with
`@rtorcato/api-errors` so validation failures surface as `BadRequestError`.

```ts
import { validate } from '@rtorcato/api-validation'
import { z } from 'zod'

const Body = z.object({ email: z.string().email() })

// throws BadRequestError('Error #1: ...') on bad input
const body = validate(Body, await req.json())
```

## API

### `validate(schema, data)`

Parses `data` with `schema`, returning the typed result. On failure throws a
`BadRequestError` (code `validation_error`) whose message is the formatted Zod
issues — caught by the error handler in `api-errors-express` / `api-errors-hono`.

### `formatZodError(error, options?)`

Turns a `ZodError` into a single human-readable string. `options` are
[`zod-error`](https://www.npmjs.com/package/zod-error) `ErrorMessageOptions`.

## Peer dependencies

`zod ^3.23`.

## License

MIT

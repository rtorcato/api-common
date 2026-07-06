# @rtorcato/api-validation

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-validation.svg)](https://www.npmjs.com/package/@rtorcato/api-validation)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-validation.svg)](https://www.npmjs.com/package/@rtorcato/api-validation)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-validation)](https://bundlephobia.com/package/@rtorcato/api-validation)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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

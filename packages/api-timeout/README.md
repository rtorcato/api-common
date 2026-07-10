# @rtorcato/api-timeout

[![npm version](https://img.shields.io/npm/v/@rtorcato/api-timeout.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout)
[![npm downloads](https://img.shields.io/npm/dm/@rtorcato/api-timeout.svg)](https://www.npmjs.com/package/@rtorcato/api-timeout)
[![Bundle size](https://img.shields.io/bundlephobia/minzip/@rtorcato/api-timeout)](https://bundlephobia.com/package/@rtorcato/api-timeout)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Framework-agnostic per-request timeout. Races a promise against a deadline and
rejects with a `ServiceUnavailableError` (503) from
[`@rtorcato/api-errors`](https://www.npmjs.com/package/@rtorcato/api-errors).

```ts
import { withTimeout } from '@rtorcato/api-timeout'

// Resolves with the fetch result, or rejects with a 503 after 2s.
const user = await withTimeout(fetchUser(id), 2000)
```

## API

### `withTimeout(promise, ms)`

Returns a promise that:

- **resolves/rejects** with `promise`'s own result if it settles within `ms`;
- **rejects** with a `ServiceUnavailableError` (503) once `ms` elapses.

The timer is always cleared, so a promise that settles first leaves nothing
dangling.

> On timeout the losing promise keeps running — JS has no cancellation. Its
> result is discarded; make the wrapped work idempotent/abortable if that
> matters.

For HTTP middleware, use the framework adapters
[`@rtorcato/api-timeout-express`](https://www.npmjs.com/package/@rtorcato/api-timeout-express)
and
[`@rtorcato/api-timeout-hono`](https://www.npmjs.com/package/@rtorcato/api-timeout-hono).

## License

MIT

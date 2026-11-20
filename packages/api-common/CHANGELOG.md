# @rtorcato/api-common

## 1.0.0

### Major Changes

- 3421943: First release of `@rtorcato/api-common`, which replaces the 37 `@rtorcato/api-*` packages. Each old package is now a subpath export: `@rtorcato/api-auth-express` becomes `@rtorcato/api-common/auth/express`, `@rtorcato/api-upload` becomes `@rtorcato/api-common/upload/express` and `@rtorcato/api-express-utils` becomes `@rtorcato/api-common/express-utils`. There is no root export.
  
  Every third-party library is now an optional peer dependency, and `@rtorcato/js-common` is the only dependency. Install the peers for the subpaths you use. `jsonwebtoken`, `cors`, `helmet`, `pino`, `dotenv`, `dotenv-expand`, `zod-error`, `supertest` and `zod` used to be installed for you by some packages. `zod` is needed by `config`, `logger`, `errors/express` and `errors/hono`.
  
  Requires Node.js `>=24`. This also carries the changes that were pending for the old packages: `@rtorcato/js-common` `^6.2.1`, and the `amqplib` peer range `^0.10.0 || ^2.0.0`, which accepts amqplib 2.x. The `@scalar/hono-api-reference` peer range now also accepts `^0.12.0`.

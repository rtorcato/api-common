# @rtorcato/api-auth-express

Express middleware for JWT authentication, built on `@rtorcato/api-auth`.

## Install

```sh
pnpm add @rtorcato/api-auth-express @rtorcato/api-auth jsonwebtoken
```

## Usage

```ts
import { authMiddleware, optionalAuthMiddleware } from '@rtorcato/api-auth-express'

// Require a valid JWT — responds 401 if missing or invalid
app.use(authMiddleware(process.env.JWT_SECRET))

// Set req.user if token present and valid, always continues
app.use(optionalAuthMiddleware(process.env.JWT_SECRET))
```

Token is read from `Authorization: Bearer <token>` header, falling back to a `token` cookie. Use `{ cookieName }` to override the cookie name.

Pairs with `@rtorcato/api-errors-express` `errorHandler` to format the `UnauthorizedError` responses.

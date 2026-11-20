// `swagger-jsdoc` ships no type declarations. It's an optional peer dependency, dynamically
// imported in specFromJsDoc(); we cast it to the small shape we use, so an ambient `any` is enough.
declare module 'swagger-jsdoc'

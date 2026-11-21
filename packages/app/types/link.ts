/**
 * The destination a component's `to` prop accepts.
 *
 * A structural copy of vue-router's `RouteLocationRaw` rather than an import
 * of it: `@khsura/sui` does not depend on vue-router, and its published
 * declarations must type-check in an app that never installed it. Every value
 * vue-router accepts (a path string, or a location object by path or by name)
 * fits this type, so apps with a router lose nothing.
 */
export type LinkLocationObject = {
  path?: string
  name?: string | symbol
  params?: object
  query?: object
  hash?: string
  replace?: boolean
  force?: boolean
  state?: object
}

export type LinkLocation = string | LinkLocationObject

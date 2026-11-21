import type { LinkLocation } from '@/app/types'

const toQueryString = (query: object) => {
  const searchParams = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    const values: unknown[] = Array.isArray(value) ? value : [value]

    values.forEach((entry) => {
      if (entry !== undefined && entry !== null) {
        searchParams.append(key, String(entry))
      }
    })
  })

  const queryString = searchParams.toString()

  return queryString ? `?${queryString}` : ''
}

/**
 * The plain URL a `to` location points at, for apps without vue-router.
 *
 * A path string is already a URL. A location object resolves only when it
 * names a `path`; a route addressed by `name` needs the router's route table,
 * so it has no URL here and the result is `undefined`.
 */
export const getLinkLocationHref = (location: LinkLocation): string | undefined => {
  if (typeof location === 'string') {
    return location
  }

  if (location.path === undefined) {
    return undefined
  }

  const query = location.query ? toQueryString(location.query) : ''

  return `${location.path}${query}${location.hash ?? ''}`
}

import { type PropsTag, type PropsLink } from '@/app/definitions'
import { useLinkService } from '@/app/services'

/**
 * Called outside a component there is no app, so no vue-router either:
 * `to` degrades to a plain anchor. The router case is covered by
 * `tests/components/linkElements.test.ts`, which mounts inside an app.
 */
describe('useLinkService', () => {
  const keibaWebURL = 'https://keiba.rakuten.co.jp/'
  const dummyRoute = 'dummy-route'

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('useLinkService with all required props as null', () => {
    const props: PropsLink & PropsTag = {
      to: null,
      href: null,
      tag: null,
    }

    const service = useLinkService(props)

    expect(service.isLink.value).toBe(false)
    expect(service.tag.value).toBe('div')
  })

  test('`to` wins over `href` and `tag`, rendering an anchor to the route without a router', () => {
    const service = useLinkService({ to: dummyRoute, href: keibaWebURL, tag: 'section' })

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('a')
    expect(service.linkAttrs.value).toEqual({ href: dummyRoute })
  })

  test('useLinkService with only `href` property passed in props', () => {
    const props = {
      to: null,
      href: keibaWebURL,
      tag: null,
    }

    const service = useLinkService(props)

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('a')
  })

  test('a location object with a path resolves to its URL without a router', () => {
    const service = useLinkService({ to: { path: '/users', query: { page: 2, tag: ['a', 'b'] }, hash: '#top' } })

    expect(service.tag.value).toBe('a')
    expect(service.linkAttrs.value).toEqual({ href: '/users?page=2&tag=a&tag=b#top' })
  })

  test('a named route has no URL without a router and falls back to `href`', () => {
    const service = useLinkService({ to: { name: 'users' }, href: keibaWebURL })

    expect(service.tag.value).toBe('a')
    expect(service.linkAttrs.value).toEqual({ href: keibaWebURL })
  })

  test('`to` without a router warns once', () => {
    useLinkService({ to: dummyRoute })

    expect(console.warn).toHaveBeenCalledTimes(1)
    expect(vi.mocked(console.warn).mock.calls[0]?.[0]).toContain('no vue-router')
  })

  test('no `to`, no warning', () => {
    useLinkService({ href: keibaWebURL })

    expect(console.warn).not.toHaveBeenCalled()
  })
})

import { PropsTag, type PropsLink } from '@sui/app/definitions'
import { useLinkService } from '@sui/app/services'

describe('useLinkService', () => {
  const keibaWebURL = 'https://keiba.rakuten.co.jp/'
  const dummyRoute = 'dummy-route'

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

  test('useLinkService with all required props & optional params', () => {
    const props = {
      to: dummyRoute,
      href: keibaWebURL,
    }

    const service = useLinkService({ ...props, tag: 'section' })

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('router-link')
  })

  test('useLinkService with only `href` property passed in props', () => {
    const props = {
      to: null,
      href: keibaWebURL,
      tag: null
    }

    const service = useLinkService(props)

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('a')
  })

  test('useLinkService with only `to` property passed in props', () => {
    const props = {
      to: dummyRoute,
      href: null,
      tag: null,
    }

    const service = useLinkService(props)

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('router-link')
  })

  test('useLinkService with all required props', () => {
    const props = {
      to: dummyRoute,
      href: keibaWebURL,
      tag: null,
    }

    const service = useLinkService(props)

    expect(service.isLink.value).toBe(true)
    expect(service.tag.value).toBe('router-link')
  })
})

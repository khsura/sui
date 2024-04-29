import { type PropsContent } from '@sui/app/types'
import { useContentService } from '@sui/app/services'

describe('useContentService', () => {
  const emptyPropsContent: PropsContent = {
    contentClass: {},
    contentStyle: {},
  }

  it('test content service by passing empty object', () => {
    const service = useContentService(emptyPropsContent)

    expect(service.classes.value).toMatchObject({})
    expect(service.styles.value).toMatchObject({})
  })

  it('test content service by passing non-empty object', () => {
    const propsContent: PropsContent = {
      contentClass: {
        classA: true,
      },
      contentStyle: {
        border: 'double',
        color: 'blue',
      },
    }

    const service = useContentService(propsContent)

    expect(service.classes.value).toMatchObject({ classA: true })
    expect(service.styles.value).toMatchObject({ border: 'double', color: 'blue' })
  })

  it('test content service by passing props as string', () => {
    const propsContent: PropsContent = {
      contentClass: 'classA',
      contentStyle: 'border',
    }

    const service = useContentService(propsContent)

    expect(service.classes.value).toMatchObject({ classA: true })
    expect(service.styles.value).toMatchObject({ border: true })
  })

  it('test content service by passing props as array', () => {
    const propsContent: PropsContent = {
      contentClass: ['classNameA', 'classNameB'],
      contentStyle: ['border', 'padding'],
    }

    const service = useContentService(propsContent)

    expect(service.classes.value).toMatchObject({ 'classNameA classNameB': true })
    expect(service.styles.value).toMatchObject({ 'border padding': true })
  })
})

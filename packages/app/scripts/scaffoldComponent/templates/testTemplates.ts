import type { ComponentNames } from '../types'

/** tests/components/sX.test.ts: mounts inside SApp like the other component tests. */
export const renderTestFile = (names: ComponentNames): string => `import { ${names.component} } from '@/app/components'
import { type ${names.propsType} } from '@/app/definitions'
import { mountWithApp } from '@/app/tests/_helpers'

// TODO(scaffold): test every prop, slot and event, the keyboard behaviour and the ARIA attributes.
describe('${names.component}', () => {
  const get${names.component} = (props?: Partial<${names.propsType}>) => {
    return mountWithApp(${names.component}, { props: { ...props } })
  }

  test('renders the root class', () => {
    const wrapper = get${names.component}()

    expect(wrapper.classes('${names.cssBlock}')).toBe(true)
  })

  test('shows the text prop when the default slot is empty', () => {
    const wrapper = get${names.component}({ text: 'Hello' })

    expect(wrapper.text()).toBe('Hello')
  })

  test('can change the background colour', () => {
    const wrapper = get${names.component}({ color: 'primary' })

    expect(wrapper.classes('s_backgroundColor__primary')).toBe(true)
  })

  test('can change the size', () => {
    const wrapper = get${names.component}({ size: 'large' })

    expect(wrapper.classes('${names.cssBlock}--size__large')).toBe(true)
  })
})
`

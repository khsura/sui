import { SIcon } from '@sui/app/components'
import { SizeProperty } from '@sui/app/constants'
import { type PropsIcon } from '@sui/app/definitions'
import { mount } from '@vue/test-utils'

describe('SIcon', () => {
  const getSIconWithBuiltinIcon = (props?: Partial<PropsIcon>) => {
    return mount(SIcon, { props: { icon: 'mdi-camera-outline', ...props } })
  }

  test('can change size of builtin icon', () => {
    const wrapper = getSIconWithBuiltinIcon({ size: SizeProperty.large })

    expect(wrapper.classes('s_icon--size__large')).toBe(true)
  })

  test('can change rotation', () => {
    const wrapper = getSIconWithBuiltinIcon({ rotated: true })

    expect(wrapper.classes('s_icon--rotated')).toBe(true)
  })

  test('can change spin', () => {
    const wrapper = getSIconWithBuiltinIcon({ spin: true })

    expect(wrapper.classes('s_icon--spin')).toBe(true)
  })

  test('can display mdi icon', () => {
    const wrapper = mount(SIcon, { propsData: { icon: 'mdi-rabbit' } })

    expect(wrapper.classes('mdi')).toBe(true)
    expect(wrapper.classes('mdi-rabbit')).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  test('can change color using theme props - dark', () => {
    const wrapper = getSIconWithBuiltinIcon({ theme: 'dark' })

    expect(wrapper.classes('s_dark')).toBe(true)
    expect(wrapper.classes('s_light')).toBe(false)
  })

  test('can change color using theme props - light', () => {
    const wrapper = getSIconWithBuiltinIcon({ theme: 'light' })

    expect(wrapper.classes('s_dark')).toBe(false)
    expect(wrapper.classes('s_light')).toBe(true)
  })
})

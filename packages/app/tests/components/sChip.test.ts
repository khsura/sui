import { SChip } from '@sui/app/components'
import { type PropsChip } from '@sui/app/definitions'
import { mount } from '@vue/test-utils'

describe('SChip', () => {
  const getSChip = (props?: Partial<PropsChip>) => {
    return mount(SChip, { props: { label: true, ...props } })
  }

  test('can display chip', () => {
    const wrapper = getSChip()

    expect(wrapper.classes('s_chip--label')).toBe(true)
  })

  test('can change backgroundColor', () => {
    const wrapper = getSChip({ color: 'primary' })

    expect(wrapper.classes('s_backgroundColor__primary')).toBe(true)
  })

  test('can change textColor when outlined props is true', () => {
    const wrapper = getSChip({ color: 'primary', outlined: true })

    expect(wrapper.classes('s_textColor__primary')).toBe(true)
  })

  test('can change text color when underlined props is true', () => {
    const wrapper = getSChip({ color: 'primary', underlined: true })

    expect(wrapper.classes('s_textColor__primary')).toBe(true)
  })

  test('can change size', () => {
    const wrapper = getSChip({ size: 'large' })

    expect(wrapper.classes('s_chip--size__large')).toBe(true)
  })

  test('can change shape', () => {
    const wrapper = getSChip({ size: 'large' })

    expect(wrapper.classes('s_chip--size__large')).toBe(true)
  })

  test('closable button appears', () => {
    const wrapper = getSChip({ closable: true })

    expect(wrapper.find('.s_chip__closeIcon').exists()).toBe(true)
  })

  test('can emit click event if link prop is true', async () => {
    const wrapper = getSChip({ link: true })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeTruthy()
  })

  test('can not emit click event if link prop is false', async () => {
    const wrapper = getSChip({ link: false })

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toBeFalsy()
  })

  test('can emit close event', async () => {
    const wrapper = getSChip({ closable: true })

    await wrapper.find('.s_chip__closeIcon').trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

import { mount, type VueWrapper } from '@vue/test-utils'
import { SDatePicker } from '@/app/components'

const getWrapper = (type: 'month' | 'year', modelValue: string) => {
  return mount(SDatePicker, {
    props: { type, modelValue, today: '2026-10-22', min: '2021-01-01', max: '2026-12-31', hideTitle: true },
  })
}

const lastEmittedValue = (wrapper: VueWrapper) => {
  const emitted = wrapper.emitted('update:modelValue') ?? []

  return emitted[emitted.length - 1]
}

describe('SDatePicker', () => {
  test('selects a month with the month type', async () => {
    const wrapper = getWrapper('month', '2026-10')
    const [, , march] = wrapper.findAll('.s_datePickerMonth__button')

    await march?.trigger('click')

    expect(lastEmittedValue(wrapper)).toEqual(['2026-03'])
  })

  test('selects a year with the year type', async () => {
    const wrapper = getWrapper('year', '2026')
    const year2024 = wrapper.findAll('.s_datePickerYear .s_button').find((button) => button.text().includes('2024'))

    await year2024?.trigger('click')

    expect(lastEmittedValue(wrapper)).toEqual(['2024'])
  })
})

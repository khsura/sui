import { mount, type VueWrapper } from '@vue/test-utils'
import { SDatePicker } from '@/app/components'

const getWrapper = (type: 'month' | 'year', modelValue: string, yearFormat?: string) => {
  return mount(SDatePicker, {
    props: { type, modelValue, today: '2026-10-22', min: '2021-01-01', max: '2026-12-31', hideTitle: true, yearFormat },
  })
}

const yearListTitles = (wrapper: VueWrapper) => {
  return wrapper.findAll('.s_datePickerYear .s_button').map((button) => button.text())
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

  test('lists the years as plain numbers by default', () => {
    const wrapper = getWrapper('year', '2026')

    expect(yearListTitles(wrapper)).toEqual(['2026', '2025', '2024', '2023', '2022', '2021'])
  })

  test.each([
    ['YYYY [он]', '2026 он'],
    ['YYYY年', '2026年'],
    ['YYYY', '2026'],
  ])('lists the years in the yearFormat %s', (yearFormat, expectedTitle) => {
    const wrapper = getWrapper('year', '2026', yearFormat)

    expect(yearListTitles(wrapper)[0]).toBe(expectedTitle)
  })
})

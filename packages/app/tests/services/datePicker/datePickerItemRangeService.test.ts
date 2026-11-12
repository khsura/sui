import { type PropsDatePickerItem } from '@/app/definitions'
import { useDatePickerItemDateService, useDatePickerItemYearService } from '@/app/services'

const baseProps: PropsDatePickerItem = {
  type: 'date',
  today: '2026-11-12',
  date: '2026-11-12',
  selected: null,
  selectedType: 'date',
}

const emit = () => undefined

describe('date picker default range without min/max', () => {
  test('the year view lists today ±5 years, all selectable', () => {
    const { years } = useDatePickerItemYearService({ ...baseProps, selectedType: 'year' }, emit)
    const values = years.value.map(({ value }) => value)

    expect(values[0]).toBe(2031)
    expect(values[values.length - 1]).toBe(2021)
    expect(years.value.every(({ isDisabled }) => !isDisabled)).toBe(true)
  })

  test('the date view keeps every day of the month selectable', () => {
    const { dates } = useDatePickerItemDateService(baseProps, emit)
    const novemberDays = dates.value.filter(({ isCurrentMonth }) => isCurrentMonth)

    expect(novemberDays).toHaveLength(30)
    expect(novemberDays.every(({ isDisabled }) => !isDisabled)).toBe(true)
  })

  test('an explicit min or max still applies, the other side keeps its default', () => {
    const { years } = useDatePickerItemYearService({ ...baseProps, selectedType: 'year', min: '2024-01-01' }, emit)
    const values = years.value.map(({ value }) => value)

    expect(values[0]).toBe(2031)
    expect(values[values.length - 1]).toBe(2024)
  })
})

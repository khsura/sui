import { ref } from 'vue'
import { type PropsDatePickerInput } from '@/app/definitions'
import { useDatePickerInputService } from '@/app/services'

const defaultProps: PropsDatePickerInput = {
  type: 'date',
  today: '2026-10-21',
  dateFormat: 'MMM D',
  monthFormat: 'MMMM',
  yearFormat: 'YYYY',
  carousel: false,
  label: null,
  placeholder: null,
  simple: null,
  tile: false,
  disabled: false,
  readonly: false,
  max: '2026-12-31',
  min: '2026-01-01',
}

const getService = (props: Partial<PropsDatePickerInput> = {}, modelValue: string | null = '2026-10-21') => {
  const model = ref<string | null>(modelValue)
  const service = useDatePickerInputService({ ...defaultProps, ...props }, model)

  return { ...service, model }
}

describe('useDatePickerInputService', () => {
  test('steps the date value by one day for the date type', () => {
    const { stepNext, stepPrev } = getService()

    expect(stepNext()).toBe('2026-10-22')
    expect(stepPrev()).toBe('2026-10-20')
  })

  test('steps the date value by one month for the month type', () => {
    const { stepNext, stepPrev } = getService({ type: 'month', min: '2020-01-01', max: '2030-12-31' }, '2026-10')

    expect(stepNext()).toBe('2026-11')
    expect(stepPrev()).toBe('2026-09')
  })

  test('steps the date value by one year for the year type', () => {
    const { stepNext, stepPrev } = getService({ type: 'year', min: '2020-01-01', max: '2030-12-31' }, '2026')

    expect(stepNext()).toBe('2027')
    expect(stepPrev()).toBe('2025')
  })

  test('does not step beyond the max bound for the year type', () => {
    const { stepNext, canStepNext } = getService({ type: 'year', max: '2026-12-31' }, '2026')

    expect(canStepNext.value).toBe(false)
    expect(stepNext()).toBeUndefined()
  })

  test('does not step beyond the max bound', () => {
    const { stepNext, canStepNext } = getService({ max: '2026-10-21' }, '2026-10-21')

    expect(canStepNext.value).toBe(false)
    expect(stepNext()).toBeUndefined()
  })

  test('does not step beyond the min bound', () => {
    const { stepPrev, canStepPrev } = getService({ min: '2026-10-21' }, '2026-10-21')

    expect(canStepPrev.value).toBe(false)
    expect(stepPrev()).toBeUndefined()
  })

  test('does not step when there is no value', () => {
    const { stepNext, stepPrev, canStepNext, canStepPrev } = getService({}, null)

    expect(canStepNext.value).toBe(false)
    expect(canStepPrev.value).toBe(false)
    expect(stepNext()).toBeUndefined()
    expect(stepPrev()).toBeUndefined()
  })

  test('does not step when the input is disabled or readonly', () => {
    const disabled = getService({ disabled: true })
    const readonly = getService({ readonly: true })

    expect(disabled.canStepNext.value).toBe(false)
    expect(disabled.stepNext()).toBeUndefined()
    expect(readonly.canStepNext.value).toBe(false)
    expect(readonly.stepNext()).toBeUndefined()
  })

  test('exposes the model format of the current type', () => {
    expect(getService({ type: 'date' }).inputFormat.value).toBe('YYYY-MM-DD')
    expect(getService({ type: 'month' }).inputFormat.value).toBe('YYYY-MM')
    expect(getService({ type: 'year' }).inputFormat.value).toBe('YYYY')
  })
})

import { DatePickerSelectType, DatePickerType } from '@/app/constants/datePicker'
import { type DatePickerSelectTypeType } from '@/app/types'

export const datePickerDisplayFormat = {
  [DatePickerSelectType.date]: 'MMM D',
  [DatePickerSelectType.month]: 'MMMM',
  [DatePickerSelectType.year]: 'YYYY',
} as const

export const datePickerModelFormats = {
  [DatePickerType.date]: 'YYYY-MM-DD',
  [DatePickerType.month]: 'YYYY-MM',
  [DatePickerType.year]: 'YYYY',
} as const

/**
 * Granularity of a single carousel step, per picker type.
 * `step` shifts the value, `compare` checks it against the `min`/`max` bounds.
 */
export const datePickerStepUnits = {
  [DatePickerType.date]: { step: 'day', compare: 'date' },
  [DatePickerType.month]: { step: 'month', compare: 'month' },
  [DatePickerType.year]: { step: 'year', compare: 'year' },
} as const

export const datePickerSelectTypes: DatePickerSelectTypeType[] = [
  DatePickerSelectType.date,
  DatePickerSelectType.month,
  DatePickerSelectType.year,
]

export const monthPickerDisplayFormat = {
  [DatePickerSelectType.month]: 'MMMM',
  [DatePickerSelectType.year]: 'YYYY',
} as const

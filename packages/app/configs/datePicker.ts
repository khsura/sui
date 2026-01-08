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

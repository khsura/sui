import { DatePickerSelectType, DatePickerType } from '@khsura/sui/constants/datePicker'
import { type DatePickerSelectTypeType } from '@khsura/sui/types'

export const datePickerDisplayFormat = {
  [DatePickerSelectType.date]: 'M月D日',
  [DatePickerSelectType.month]: 'MMMM',
  [DatePickerSelectType.year]: 'YYYY年',
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
  [DatePickerSelectType.year]: 'YYYY年',
} as const

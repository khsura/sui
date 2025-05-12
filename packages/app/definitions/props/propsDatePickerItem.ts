import { type DatePickerTypeType, type DatePickerSelectTypeType } from '@khsura/sui/types/datePicker'
import { type PropsColor } from './core'

export type PropsDatePickerItem = {
  type: DatePickerTypeType
  today: string
  date: string
  selected?: string | null
  selectedType: DatePickerSelectTypeType
  height?: number | null
  dateFormat?: string
  monthFormat?: string
  yearFormat?: string
  disabled?: boolean
  readonly?: boolean
  max?: string
  min?: string
  dense?: boolean
} & PropsColor

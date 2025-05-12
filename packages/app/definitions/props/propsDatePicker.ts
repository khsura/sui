import { type DatePickerTypeType } from '@khsura/sui/types/datePicker'
import { type PropsColor, type PropsMeasurableStyles } from './core'

export type PropsDatePicker = {
  type: DatePickerTypeType
  hideTitle?: boolean
  dateFormat?: string
  monthFormat?: string
  yearFormat?: string
  today?: string
  disabled?: boolean
  readonly?: boolean
  max?: string
  min?: string
  dense?: boolean
} & PropsColor &
  PropsMeasurableStyles

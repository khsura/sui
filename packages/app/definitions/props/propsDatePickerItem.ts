import { type PropsColor } from './core'
import { type DatePickerTypeType, type DatePickerSelectTypeType } from '@/app/types'

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

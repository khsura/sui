import type { PropsSizePreset } from './propsSizePreset'
import type { PropsDatePicker } from './propsDatePicker'
import type { PropsFormInput } from './propsFormInput'

export type PropsDatePickerInput = {
  label?: string | null
  placeholder?: string | null
  simple?: boolean | null
  tile?: boolean
} & PropsDatePicker &
  PropsFormInput &
  PropsSizePreset

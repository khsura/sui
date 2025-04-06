import { type InputModeTypeText, type InputTypeText } from '@khsura/sui/types'
import { type PropsFormInput } from './propsFormInput'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsInput = {
  placeholder?: string
  type?: InputTypeText
  inputmode?: InputModeTypeText
  label?: string
  inputBackground?: string
  placeholderBackground?: string
  max?: string | number
  min?: string | number
  spellcheck?: boolean
  autocapitalize?: 'on' | 'off'
  autocomplete?: string
  autofocus?: boolean
  pattern?: string
  suffix?: string
  simple?: boolean
  appendOuter?: string
  textRight?: boolean
  positive?: boolean
  usePreviousValueWhenExceeded?: boolean
  dense?: boolean
  tile?: boolean
  minlength?: string | number | null
  maxlength?: string | number | null
  ariaLabelledby?: string
  name?: string
  isPasteDisabled?: boolean
} & PropsSizePreset &
  PropsFormInput

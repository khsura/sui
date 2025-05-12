import { type InputModeTypeText, type InputTypeText } from '@khsura/sui/types'
import { type PropsFormInput } from './propsFormInput'
import { type PropsSizePreset } from './propsSizePreset'

export type PropsInput = {
  placeholder?: string | undefined | null
  type?: InputTypeText | undefined | null
  inputmode?: InputModeTypeText | undefined | null
  label?: string | undefined | null
  inputBackground?: string | undefined | null
  placeholderBackground?: string | undefined | null
  max?: string | number | undefined | null
  min?: string | number | undefined | null
  spellcheck?: boolean | undefined | null
  autocapitalize?: 'on' | 'off' | undefined | null
  autocomplete?: string | undefined | null
  autofocus?: boolean | undefined | null
  pattern?: string | undefined | null
  suffix?: string | undefined | null
  simple?: boolean | undefined | null
  appendOuter?: string | undefined | null
  textRight?: boolean | undefined | null
  positive?: boolean | undefined | null
  usePreviousValueWhenExceeded?: boolean | undefined | null
  dense?: boolean
  tile?: boolean
  minlength?: string | number | null
  maxlength?: string | number | null
  ariaLabelledby?: string
  name?: string
  isPasteDisabled?: boolean
} & PropsSizePreset &
  PropsFormInput

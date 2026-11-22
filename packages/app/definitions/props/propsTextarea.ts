import { type PropsDensity } from './core'
import { type PropsFormInput } from './propsFormInput'
import { type PropsSizePreset } from './propsSizePreset'
import { type FormInputModelValue } from '@/app/types'

export type PropsTextarea<T extends FormInputModelValue = string> = {
  cols?: number | undefined
  rows?: number | undefined
  label?: string | undefined
  resize?: boolean | undefined
  autocapitalize?: 'on' | 'off' | undefined
  autogrow?: boolean | undefined
  autocomplete?: string | undefined
  autofocus?: boolean | undefined
  placeholder?: string | undefined
  spellcheck?: boolean | undefined
  simple?: boolean | undefined
  minlength?: string | number | undefined
  maxlength?: string | number | undefined
  /** Shows the character count (`12 / 200` with `maxlength`) at the right of the error line, right under the field. */
  counter?: boolean | undefined
  // Accessible name when the visible `label` is not enough (or absent); with `hideDetails` the label is used
  ariaLabel?: string | undefined
  ariaLabelledby?: string | undefined
  name?: string | undefined
  dense?: boolean | undefined
  tile?: boolean | undefined
  inputBackground?: string | undefined
  placeholderBackground?: string | undefined
  modelValue?: T | undefined | null
} & PropsDensity &
  PropsSizePreset &
  PropsFormInput

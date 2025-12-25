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
  ariaLabelledby?: string | undefined
  name?: string | undefined
  dense?: boolean | undefined
  tile?: boolean | undefined
  inputBackground?: string | undefined
  placeholderBackground?: string | undefined
  modelValue?: T | undefined | null
} & PropsSizePreset &
  PropsFormInput

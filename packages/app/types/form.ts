import { type ComputedRef } from 'vue'
import { type FormInputModelValue } from './core'

export type FormInputModelValueRule<T extends FormInputModelValue = FormInputModelValue> = (
  value?: T | undefined | null,
) => true | string

export interface FormProviderRegisterInputAttribute {
  validate: () => void
  reset: () => void
  errors: ComputedRef<string[]>
  hasError: ComputedRef<boolean>
}

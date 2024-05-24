import { type FormInputModelValueRule, type FormInputModelValue } from '@sui/app/types'
import { type PropType } from 'vue'
import { propsDisabled } from './core'

export const propsFormInput = <T extends FormInputModelValue = FormInputModelValue>(defaults?: {
  modelValue?: { required?: boolean }
}) => {
  return {
    id: {
      type: String as PropType<string>,
      default: null,
    },
    modelValue: {
      type: [String, Number, Array, Boolean] as unknown as PropType<T | undefined>,
      default: null,
      required: defaults?.modelValue?.required ?? false,
    },
    rules: {
      type: Array as PropType<FormInputModelValueRule[]>,
      default: () => [],
    },
    hideDetails: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    error: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    dirty: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    ...propsDisabled(),
  } as const
}

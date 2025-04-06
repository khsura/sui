import { type FormInputModelValueRule } from '@khsura/sui/types'
import { type PropsDisabled } from './core'

export type PropsFormInput = {
  id?: string | undefined
  // modelValue?: T | undefined
  rules?: FormInputModelValueRule[] | undefined
  hideDetails?: boolean | undefined
  error?: boolean | undefined
  dirty?: boolean | undefined
} & PropsDisabled

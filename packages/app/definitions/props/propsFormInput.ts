import { type PropsDisabled } from './core'
import { type FormInputModelValueRule } from '@/app/types'

export type PropsFormInput = {
  id?: string | undefined
  // modelValue?: T | undefined
  rules?: FormInputModelValueRule[] | undefined
  hideDetails?: boolean | undefined
  error?: boolean | undefined
  dirty?: boolean | undefined
} & PropsDisabled

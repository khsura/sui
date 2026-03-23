import { argsBorder, argsDisabled } from './core'
import type { PropsRadioGroup } from '@/app/index'

export const argsRadioGroup: Omit<PropsRadioGroup, 'modelValue' | 'rules' | 'error' | 'dirty'> = {
  ...argsBorder,
  ...argsDisabled,
  color: '',
  column: false,
  continuous: false,
  grow: false,
  hideDetails: false,
  hideError: false,
  id: 'radioGroup',
  mandatory: false,
}

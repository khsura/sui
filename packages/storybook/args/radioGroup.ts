import type { PropsRadioGroup } from '@khsura/sui/index'
import { argsBorder, argsDisabled } from './core'

export const argsRadioGroup: Omit<PropsRadioGroup, 'modelValue' | 'rules' | 'error' | 'dirty'> = {
  ...argsBorder,
  ...argsDisabled,
  color: '',
  column: false,
  continuous: false,
  grow: false,
  hideDetails: false,
  id: 'radioGroup',
  mandatory: false,
}

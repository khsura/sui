import type { GroupItemValue } from '@khsura/sui/types'

export type PropsGroup<T extends GroupItemValue = GroupItemValue> = {
  multiple?: boolean
  mandatory?: boolean
  modelValue?: T[] | null
}

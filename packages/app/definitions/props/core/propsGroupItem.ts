import { type GroupItemValue } from '@khsura/sui/types/core'

export type PropsGroupItem<T extends GroupItemValue = GroupItemValue> = {
  index?: T | null
  disabled?: boolean
  activeClass?: string | null
}

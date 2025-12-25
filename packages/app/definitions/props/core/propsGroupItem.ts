import { type GroupItemValue } from '@/app/types'

export type PropsGroupItem<T extends GroupItemValue = GroupItemValue> = {
  index?: T | null
  disabled?: boolean
  activeClass?: string | null
}

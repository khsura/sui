import type { GroupItemValue } from '@/app/types'

export type PropsGroup<T extends GroupItemValue = GroupItemValue> = {
  multiple?: boolean
  mandatory?: boolean
  modelValue?: T[] | null
}

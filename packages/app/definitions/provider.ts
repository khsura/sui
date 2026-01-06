import { type ComputedRef, type Ref } from 'vue'
import { type GroupItemValue } from '@/app/types'

export interface GroupProvider<T extends GroupItemValue = GroupItemValue> {
  registerItem: (name: T, attrs: { element?: Ref<HTMLElement | null> }) => number
  unregisterItem: (name: T | undefined) => void
  toggleItem: (name: T | undefined) => void
  isSelectedItem: (name: T | undefined) => boolean
  items: ComputedRef<Array<{ value: T; readonly element: HTMLElement | null }>>
}

export interface SingleGroupProvider extends GroupProvider {
  selectedItem: ComputedRef<{ value?: GroupItemValue | undefined; id: number }>
}

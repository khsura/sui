import { ref } from 'vue'
import { type Ref } from 'vue'
import { type GroupProvider } from '@khsura/sui/definitions'
import { type GroupItemValue } from '@khsura/sui/types'

export const useGroupCoreService = <T extends GroupItemValue = GroupItemValue>() => {
  const items: Ref<Array<{ value: T; readonly element: HTMLElement | null }>> = ref([])

  const getItemIndex = (value: T | null | undefined) => {
    if (value === null || value === undefined) {
      return -1
    }

    return items.value.findIndex((item) => value === item.value)
  }

  const register: GroupProvider<T>['registerItem'] = (name, item) => {
    items.value = [
      ...items.value,
      {
        value: name,
        get element() {
          return item.element?.value ?? null
        },
      },
    ]

    return items.value.length - 1
  }

  const unregister: GroupProvider<T>['unregisterItem'] = (name) => {
    const index = getItemIndex(name)
    const tempItems = [...items.value]

    if (index > -1) {
      tempItems.splice(index, 1)
      items.value = tempItems
    }
  }

  return {
    items,
    register,
    unregister,
    getItemIndex,
  }
}

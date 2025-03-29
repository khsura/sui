import { ref } from 'vue'
import { type Ref } from 'vue'
import { type ProviderName } from '~/constants'
import { type Provider } from '~/definitions'
import { type GroupItemValue } from '~/types'

export const useGroupCoreService = () => {
  const items: Ref<Array<{ value: GroupItemValue; readonly element: HTMLElement | null }>> = ref([])

  const getItemIndex = (value: GroupItemValue | null | undefined) => {
    if (value === null || value === undefined) {
      return -1
    }

    return items.value.findIndex((item) => value === item.value)
  }

  const register: Provider[ProviderName.group]['registerItem'] = (name, item) => {
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

  const unregister: Provider[ProviderName.group]['unregisterItem'] = (name) => {
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

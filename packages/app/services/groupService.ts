import { type Ref, computed, ref, type ModelRef } from 'vue'
import { watch } from 'vue'
import { ProviderName, ProviderPropsName } from '@khsura/sui/constants/provider'
import { type PropsGroup } from '@khsura/sui/definitions'
import { type GroupItemValue } from '@khsura/sui/types'
import { useProviderService } from './core/providerService'
import { useGroupCoreService } from './core/groupCoreService'

export const useGroupService = <T extends GroupItemValue = GroupItemValue>(
  props: PropsGroup,
  model: ModelRef<T[] | null>,
) => {
  const { provide, provideProps } = useProviderService()
  const { items, register, unregister, getItemIndex } = useGroupCoreService<T>()
  const clickValue: Ref<T | undefined> = ref()

  provideProps(ProviderPropsName.groupProps, props)

  const firstIndexItem = computed<T | undefined>(() => {
    return items.value[0]?.value ?? undefined
  })

  const formatItems = (value?: T[] | null | undefined) => {
    const toBeUpdatedItems = [...(value ?? [])]
    const firstItem = firstIndexItem.value

    if (toBeUpdatedItems.length === 0 && props.mandatory && firstItem) {
      return [firstItem]
    }

    if (!props.multiple && toBeUpdatedItems.length > 1) {
      return [clickValue.value ?? toBeUpdatedItems[0] ?? firstItem]
    }

    return toBeUpdatedItems
  }

  const selectedItems = computed({
    get: () => {
      return formatItems(model.value)
    },
    set: (value: T[] | null) => {
      model.value = formatItems(value)
    },
  })

  const isSelectedItem = (value: T | undefined) => {
    return value !== undefined && selectedItems.value.includes(value)
  }

  const updateItems = (params: { clickValue: T | null; selectedItems: Iterable<T> }) => {
    selectedItems.value = [...params.selectedItems]
    clickValue.value = params.clickValue ?? firstIndexItem.value
  }

  const addSelectedItem = (value: T | undefined) => {
    const clickValue = value ?? firstIndexItem.value

    if (clickValue === undefined) {
      return
    }

    if (props.multiple) {
      const tempSelectedItems = new Set([...selectedItems.value])

      tempSelectedItems.add(clickValue)
      updateItems({ selectedItems: tempSelectedItems, clickValue })
    } else {
      updateItems({ selectedItems: [clickValue], clickValue })
    }
  }

  const removeSelectedItem = (value: T | undefined) => {
    const clickValue = value ?? firstIndexItem.value

    if (clickValue === undefined) {
      return
    }

    if (props.multiple) {
      const tempSelectedItems = new Set([...selectedItems.value])

      if (tempSelectedItems.has(clickValue) && (!props.mandatory || tempSelectedItems.size > 1)) {
        tempSelectedItems.delete(clickValue)
        updateItems({ selectedItems: tempSelectedItems, clickValue })
      }
    } else {
      updateItems({ selectedItems: props.mandatory ? [clickValue] : [], clickValue })
    }
  }

  const init = () => {
    selectedItems.value = [...selectedItems.value]
  }

  watch([() => props.mandatory, () => props.multiple], init)

  // TODO: Fix types
  provide(ProviderName.group, {
    registerItem: (name, item) => {
      const id = register(name as T, item)

      init()

      return id
    },
    unregisterItem: (name) => {
      unregister(name as T)
    },
    toggleItem: (value) => {
      if (isSelectedItem(value as T)) {
        removeSelectedItem(value as T)
      } else {
        addSelectedItem(value as T)
      }
    },
    isSelectedItem: (value) => {
      return isSelectedItem(value as T)
    },
    items: computed<Array<{ value: GroupItemValue; element: Readonly<HTMLElement | null> }>>(() => {
      return items.value
    }),
  })

  return {
    selectedItems,
    items,
    clickValue,
    getItemIndex,
    isSelectedItem,
  }
}

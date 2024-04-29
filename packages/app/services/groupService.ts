import { ProviderName, ProviderPropsName } from '@sui/app/constants/provider'
import { type PropsGroup } from '@sui/app/definitions/props'
import { useProviderService } from './core/providerService'
import { useGroupCoreService } from './core/groupCoreService'
import { type Ref, computed, ref, type ModelRef } from 'vue'
import { type GroupItemValue } from '@sui/app/types'
import { watch } from 'vue'

export const useGroupService = (props: PropsGroup, model: ModelRef<GroupItemValue[] | null>) => {
  const { provide, provideProps } = useProviderService()
  const { items, register, unregister, getItemIndex } = useGroupCoreService()
  const clickValue: Ref<GroupItemValue | null> = ref(null)

  provideProps(ProviderPropsName.groupProps, props)

  const firstIndexItem = computed<GroupItemValue | null>(() => {
    return items.value[0]?.value ?? null
  })

  const formatItems = (value?: GroupItemValue[] | null | undefined) => {
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
    set: (value: GroupItemValue[] | null) => {
      model.value = formatItems(value)
    },
  })

  const isSelectedItem = (value: GroupItemValue | null) => {
    return value !== null && selectedItems.value.includes(value)
  }

  const updateItems = (params: { clickValue: GroupItemValue | null; selectedItems: Iterable<GroupItemValue> }) => {
    selectedItems.value = [...params.selectedItems]
    clickValue.value = params.clickValue ?? firstIndexItem.value
  }

  const addSelectedItem = (value: GroupItemValue | null) => {
    const clickValue = value ?? firstIndexItem.value

    if (clickValue === null) {
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

  const removeSelectedItem = (value: GroupItemValue | null) => {
    const clickValue = value ?? firstIndexItem.value

    if (clickValue === null) {
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

  provide(ProviderName.group, {
    registerItem: (name, item) => {
      const id = register(name, item)

      init()

      return id
    },
    unregisterItem: (name) => {
      unregister(name)
    },
    toggleItem: (value: GroupItemValue | null) => {
      if (isSelectedItem(value)) {
        removeSelectedItem(value)
      } else {
        addSelectedItem(value)
      }
    },
    isSelectedItem,
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

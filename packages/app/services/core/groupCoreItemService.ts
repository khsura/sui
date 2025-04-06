import { computed, getCurrentInstance, onMounted, onUnmounted, ref, useId } from 'vue'
import { ProviderName } from '@khsura/sui/constants'
import {
  type GroupProvider,
  type PropsGroupItem,
  type PropsSingleGroupItem,
  type Provider,
  type SingleGroupProvider,
} from '@khsura/sui/definitions'
import { useProviderRepository } from '@khsura/sui/repositories'
import { type GroupItemValue } from '@khsura/sui/types'

export const useGroupCoreItemService = <T extends boolean>(
  props: T extends true ? PropsGroupItem : PropsSingleGroupItem,
  canSelectMultipleItem: T,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  const id = ref<number | null>(null)
  const { inject } = useProviderRepository()
  const instance = getCurrentInstance()
  const group = inject(canSelectMultipleItem ? ProviderName.group : ProviderName.singleGroup)
  const identifier = canSelectMultipleItem ? 'index' : 'value'
  const fallbackIdentifierValue = useId()

  const value = computed(() => {
    if (canSelectMultipleItem) {
      return (props as PropsGroupItem).index ?? instance?.vnode.key ?? fallbackIdentifierValue
    }

    return (props as PropsSingleGroupItem).value ?? instance?.vnode.key ?? fallbackIdentifierValue
  })

  const item = computed(() => {
    return {
      value: value.value,
      id: id.value,
    }
  })

  onMounted(() => {
    if (value.value === undefined) {
      throw new Error(`${identifier} or key property is required`)
    }

    id.value = group?.registerItem?.(value.value, injectParams ?? {}) ?? null
  })

  onUnmounted(() => {
    if (item.value.value === null) {
      throw new Error(`${identifier} or key property is required`)
    }

    group?.unregisterItem?.(item.value.value)
  })

  const isSelected = computed(() => {
    return group?.isSelectedItem?.(item.value.value) ?? false
  })

  const toggleGroupItem = (value?: GroupItemValue) => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    group?.toggleItem?.(value === undefined ? item.value.value : value)
  }

  return {
    toggleGroupItem,
    isSelected,
    item,
    group: group as (T extends true ? GroupProvider : SingleGroupProvider) | null,
  }
}

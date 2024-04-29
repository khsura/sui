import { ProviderName } from '@sui/app/constants'
import {
  type GroupProvider,
  type PropsGroupItem,
  type PropsSingleGroupItem,
  type Provider,
  type SingleGroupProvider,
} from '@sui/app/definitions'
import { type GroupItemValue } from '@sui/app/types'
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import { useProviderService } from './providerService'

export const useGroupCoreItemService = <T extends boolean>(
  props: T extends true ? PropsGroupItem : PropsSingleGroupItem,
  canSelectMultipleItem: T,
  injectParams?: Parameters<Provider[ProviderName.group]['registerItem']>[1],
) => {
  const id = ref<number | null>(null)
  const { inject } = useProviderService()
  const instance = getCurrentInstance()
  const group = inject(canSelectMultipleItem ? ProviderName.group : ProviderName.singleGroup)
  const identifier = canSelectMultipleItem ? 'index' : 'value'

  const value = computed(() => {
    if (canSelectMultipleItem) {
      return (props as PropsGroupItem).index ?? instance?.vnode.key ?? null
    }

    return (props as PropsSingleGroupItem).value ?? instance?.vnode.key ?? null
  })

  const item = computed(() => {
    return {
      value: value.value,
      id: id.value,
    }
  })

  onMounted(() => {
    if (value.value === null) {
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
    group?.toggleItem?.(value === undefined ? item.value.value : value)
  }

  return {
    toggleGroupItem,
    isSelected,
    item,
    group: group as (T extends true ? GroupProvider : SingleGroupProvider) | null,
  }
}

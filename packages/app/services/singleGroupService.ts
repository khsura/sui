import { ProviderName, ProviderPropsName } from '@sui/app/constants/provider'
import { type PropsSingleGroup } from '@sui/app/definitions'
import { type GroupItemValue } from '@sui/app/types'
import { computed, ref, watch } from 'vue'
import { useGroupCoreService } from './core/groupCoreService'
import { useProviderService } from './core/providerService'

export const useSingleGroupService = (
  props: PropsSingleGroup,
  emit: (event: 'update:modelValue', data: GroupItemValue | null) => void,
) => {
  const { provide, provideProps } = useProviderService()
  const { items, register, unregister, getItemIndex } = useGroupCoreService()
  const selected = ref<{ value: GroupItemValue | null; id: number }>({ value: null, id: -1 })

  const updateSelected = (
    params: { value: GroupItemValue | null; id: number } | null,
    {
      doNotEmitEvent = false,
    }: {
      doNotEmitEvent?: boolean
    } = { doNotEmitEvent: false },
  ) => {
    const value = params?.value ?? null
    const id = params?.id ?? -1

    selected.value = {
      value,
      id,
    }
    if (!doNotEmitEvent) {
      emit('update:modelValue', selected.value?.value ?? null)
    }
  }

  const selectById = (
    id: number,
    options?: {
      doNotEmitEvent?: boolean
    },
  ) => {
    const value = items.value[id]?.value ?? null

    updateSelected({ value, id }, options)
  }

  const selectByValue = (
    value: GroupItemValue | null,
    options?: {
      doNotEmitEvent?: boolean
    },
  ) => {
    const id = getItemIndex(value)

    updateSelected({ value, id }, options)
  }

  watch(
    () => props.modelValue,
    (value) => {
      if ((selected.value === null && props.mandatory) || value !== selected.value?.value) {
        selectByValue(value, { doNotEmitEvent: true })
      }
    },
    {
      immediate: true,
    },
  )

  const init = (force = false) => {
    if ((props.mandatory && selected.value.value === null) || force) {
      selectById(0)
    }
  }

  watch(
    () => props.mandatory,
    () => {
      init()
    },
  )

  provide(ProviderName.singleGroup, {
    registerItem: (name, item) => {
      const id = register(name, item)

      init()

      return id
    },
    unregisterItem: (name) => {
      unregister(name)
    },
    toggleItem: (name: GroupItemValue | null) => {
      if (props.mandatory) {
        selectByValue(name)

        return
      }

      const isSelected = selected.value?.value === name

      selectByValue(isSelected ? null : name)
    },
    isSelectedItem: (name) => {
      return selected.value?.value === name
    },
    selectedItem: computed(() => {
      return selected.value
    }),
    items: computed(() => {
      return items.value
    }),
  })

  provideProps(ProviderPropsName.groupSingleProps, props)

  const select = (options: { value: GroupItemValue; index?: undefined } | { index: number; value?: undefined }) => {
    if (options.index !== undefined) {
      selectById(options.index)
    } else {
      selectByValue(options.value)
    }
  }

  const canMoveBack = computed(() => {
    return props.continuous || selected.value.id !== 0
  })

  const canMoveForward = computed(() => {
    return props.continuous || selected.value.id !== items.value.length - 1
  })

  const next = () => {
    if (!canMoveForward.value) {
      return
    }

    const size = items.value.length
    const nextPossiblyIndex = selected.value.id + 1
    const nextIndex = nextPossiblyIndex >= size ? 0 : nextPossiblyIndex

    selectById(nextIndex)
  }

  const prev = () => {
    if (!canMoveBack.value) {
      return
    }

    const size = items.value.length
    const prevPossiblyIndex = selected.value.id - 1
    const prevIndex = prevPossiblyIndex < 0 ? Math.max(size - 1, 0) : prevPossiblyIndex

    selectById(prevIndex)
  }

  return {
    init,
    selected,
    items,
    canMoveBack,
    canMoveForward,
    next,
    prev,
    select,
  }
}

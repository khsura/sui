import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'
import { listboxNoActiveIndex } from '@/app/constants'

/**
 * Keyboard highlight for a popup listbox driven from a focused combobox (the `aria-activedescendant` pattern):
 * focus stays on the field while the arrow keys move a highlighted option. Disabled options are skipped.
 */
export const useListboxNavigationService = (options: {
  idPrefix: MaybeRefOrGetter<string>
  getOptionCount: () => number
  getIsOptionDisabled: (index: number) => boolean
}) => {
  const activeIndex = ref<number>(listboxNoActiveIndex)
  const listboxId = computed(() => `${toValue(options.idPrefix)}-listbox`)
  const getOptionId = (index: number) => `${toValue(options.idPrefix)}-option-${index}`

  const activeOptionId = computed(() =>
    activeIndex.value === listboxNoActiveIndex ? undefined : getOptionId(activeIndex.value),
  )

  // First enabled option from `start` in the `step` direction, without wrapping.
  const findEnabledIndex = (start: number, step: number) => {
    const optionCount = options.getOptionCount()

    for (let index = start; index >= 0 && index < optionCount; index += step) {
      if (!options.getIsOptionDisabled(index)) {
        return index
      }
    }

    return listboxNoActiveIndex
  }

  const setActiveIndex = (index: number) => {
    activeIndex.value = index
  }

  const resetActiveIndex = () => {
    activeIndex.value = listboxNoActiveIndex
  }

  const moveToFirst = () => {
    const firstIndex = findEnabledIndex(0, 1)

    if (firstIndex !== listboxNoActiveIndex) {
      activeIndex.value = firstIndex
    }
  }

  const moveToLast = () => {
    const lastIndex = findEnabledIndex(options.getOptionCount() - 1, -1)

    if (lastIndex !== listboxNoActiveIndex) {
      activeIndex.value = lastIndex
    }
  }

  // One enabled option down (`step` 1) or up (`step` -1); from no highlight, down starts at the first option.
  const moveActive = (step: 1 | -1) => {
    if (activeIndex.value === listboxNoActiveIndex) {
      if (step > 0) {
        moveToFirst()
      } else {
        moveToLast()
      }

      return
    }

    const nextIndex = findEnabledIndex(activeIndex.value + step, step)

    if (nextIndex !== listboxNoActiveIndex) {
      activeIndex.value = nextIndex
    }
  }

  return {
    activeIndex,
    activeOptionId,
    listboxId,
    getOptionId,
    setActiveIndex,
    resetActiveIndex,
    moveActive,
    moveToFirst,
    moveToLast,
  }
}

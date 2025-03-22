import { computed, ref, watch, type ModelRef } from 'vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { type PropsSlideGroup } from '@khsura/sui/definitions'
import { wait } from '@khsura/sui/lib'
import { type GroupItemValue } from '@khsura/sui/types'
import { useContentService, useProviderService } from './core'
import { useDisplayService } from './displayService'
import { useGroupService } from './groupService'
import { useScrollService } from './scrollService'

export const useSlideGroupService = (props: PropsSlideGroup, model: ModelRef<GroupItemValue[]>) => {
  const { isTouchDevice, width } = useDisplayService()
  const { smoothElementScroll } = useScrollService()
  const { items, clickValue } = useGroupService(props, model)
  const { provideProps } = useProviderService()
  const { attrs: contentAttrs } = useContentService(props)

  provideProps(ProviderPropsName.slideGroupProps, props)

  const currentX = ref<number>(0)
  const isNavigating = ref<boolean>(false)
  const elementViewport = ref<HTMLElement | null>(null)
  const elementSlidesContainer = ref<HTMLElement | null>(null)

  const getIndexFromX = (currentX: number, addX = 0) => {
    const nextX = currentX + addX
    const defaultIndex = addX > 0 ? items.value.length - 1 : 0
    const defaultOffsetX = items.value[defaultIndex]?.element?.offsetLeft ?? 0

    const output = items.value.findIndex((item, id) => {
      const currentItemX = item.element?.offsetLeft ?? defaultOffsetX
      const nextItemX = items.value[id + 1]?.element?.offsetLeft ?? defaultOffsetX

      return nextX >= currentItemX && nextX < nextItemX
    })

    return output === -1 ? defaultIndex : output
  }

  const getSlideItemsWidth = () => {
    // just for reactivity
    if (width.value === null) {
      return 0
    }

    return items.value.reduce((sum, item) => {
      return sum + (item.element?.offsetWidth ?? 0)
    }, 0)
  }

  const getViewWidth = () => {
    // just for reactivity
    if (width.value === null) {
      return 0
    }

    return elementViewport.value?.clientWidth ?? 0
  }

  const getMaxScrollSize = () => {
    return Math.max(getSlideItemsWidth() - getViewWidth(), 0)
  }

  const index = computed(() => {
    return getIndexFromX(currentX.value)
  })

  const getScrollLeftFromIndex = (index: number | undefined = undefined, offset = 0) => {
    const lastItemIndex = items.value.length - 1
    const normalizedIndex = Math.max(Math.min(index ?? lastItemIndex, lastItemIndex), 0)
    const left = items.value[normalizedIndex]?.element?.offsetLeft ?? 0

    return Math.max(Math.min(left + offset, getMaxScrollSize()), 0)
  }

  const updateSlideIndex = async (index: number, centered = false) => {
    isNavigating.value = true
    const item = items.value[index]
    const offset = centered ? getViewWidth() / 2 - (item?.element?.offsetWidth ?? 0) / 2 : 0

    currentX.value = getScrollLeftFromIndex(index, -offset)

    smoothElementScroll(elementViewport.value, { left: currentX.value, behavior: 'smooth' })
    await wait(300)
    isNavigating.value = false
  }

  const getNextSlideIndex = (direction: 1 | -1) => {
    if (props.slideStep !== null && props.slideStep !== undefined) {
      return index.value + direction * props.slideStep
    }

    return getIndexFromX(currentX.value, direction * getViewWidth())
  }

  const next = async () => {
    const index = getNextSlideIndex(1)

    await updateSlideIndex(index)
  }

  const prev = async () => {
    const index = getNextSlideIndex(-1)

    await updateSlideIndex(index)
  }

  const canGoPrevious = computed<boolean>(() => {
    return !(isNavigating.value || currentX.value === 0)
  })

  const canGoNext = computed<boolean>(() => {
    return !(isNavigating.value || currentX.value >= getMaxScrollSize())
  })

  const canScroll = computed(() => {
    return props.scrollable ?? isTouchDevice.value
  })

  const slideTo = async (groupItemValue?: GroupItemValue | undefined | null) => {
    if (groupItemValue === undefined || groupItemValue === null || !props.centerActive) {
      return
    }

    const newId = items.value.findIndex((item) => item.value === groupItemValue)

    await updateSlideIndex(newId, true)
  }

  const onScroll = () => {
    if (isNavigating.value || isNavigatorVisible.value) {
      return
    }

    currentX.value = elementViewport.value?.scrollLeft ?? 0
  }

  const isNavigatorVisible = computed(() => {
    return !canScroll.value && getSlideItemsWidth() >= getViewWidth()
  })

  watch(clickValue, async (groupItemValue) => {
    await slideTo(groupItemValue)
  })

  watch(
    model,
    async (groupItemValues) => {
      if (props.multiple) {
        return
      }

      const groupItemValue = groupItemValues?.[0]

      if (groupItemValue !== clickValue.value) {
        await slideTo(groupItemValue)
      }
    },
    {
      immediate: true,
    },
  )

  return {
    elementViewport,
    elementSlidesContainer,
    isNavigating,
    canGoPrevious,
    canGoNext,
    canScroll,
    contentAttrs,
    isNavigatorVisible,
    onScroll,
    next,
    prev,
  }
}

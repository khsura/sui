import { type Ref, computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type WatchSource } from 'vue'
import { type PropsScrollable } from '~/definitions'
import { getWindow } from '~/lib'
import { type ThresholdMetParams } from '~/types'

export const useScrollableService = (
  props?: Partial<PropsScrollable>,
  thresholdMet: (
    params: ThresholdMetParams,
  ) => Partial<Pick<ThresholdMetParams, 'isActive' | 'savedScroll'>> = () => ({}),
  watchers?: WatchSource,
) => {
  const currentScroll = ref(0)
  const currentThreshold = ref(0)
  const isActive = ref(true)
  const isScrollingUp = ref(false)
  const previousScroll = ref(0)
  const savedScroll = ref(0)
  const target: Ref<HTMLElement | Document | null> = ref(null)

  const canScroll = computed((): boolean => {
    return typeof window !== 'undefined'
  })

  const computedScrollThreshold = computed((): number => {
    return props?.scrollThreshold !== null ? Number(props?.scrollThreshold) : 300
  })

  const onScroll = () => {
    if (!canScroll.value) {
      return
    }

    previousScroll.value = currentScroll.value
    if (target.value instanceof HTMLElement) {
      currentScroll.value = target.value?.scrollTop
    } else {
      currentScroll.value = getWindow()?.scrollY ?? 0
    }

    isScrollingUp.value = currentScroll.value < previousScroll.value
    currentThreshold.value = Math.abs(currentScroll.value - computedScrollThreshold.value)

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    nextTick(() => {
      if (Math.abs(currentScroll.value - savedScroll.value) > computedScrollThreshold.value) {
        const newValues = thresholdMet({
          currentScroll: currentScroll.value,
          currentThreshold: currentThreshold.value,
          isActive: isActive.value,
          isScrollingUp: isScrollingUp.value,
          previousScroll: previousScroll.value,
          savedScroll: savedScroll.value,
          target: target.value,
          canScroll: canScroll.value,
          computedScrollThreshold: computedScrollThreshold.value,
        })

        isActive.value = newValues.isActive ?? isActive.value
        savedScroll.value = isActive.value ? 0 : (newValues.savedScroll ?? savedScroll.value)
      }
    })
  }

  watch(isScrollingUp, () => {
    savedScroll.value = savedScroll.value || currentScroll.value
  })

  if (watchers) {
    watch(watchers, onScroll)
  }

  const getScrollTarget = () => {
    const target = props?.scrollTarget ? document.querySelector<HTMLElement>(props.scrollTarget) : document

    if (!target) {
      console.warn(`Unable to locate element with identifier ${props?.scrollTarget}`, this)
    }

    return target
  }

  onMounted(() => {
    target.value = getScrollTarget()
    target.value?.addEventListener('scroll', onScroll)
  })

  onBeforeUnmount(() => {
    target.value = getScrollTarget()
    target.value?.removeEventListener('scroll', onScroll)
  })

  return {
    canScroll,
    currentScroll,
    currentThreshold,
    isActive,
    isScrollingUp,
    previousScroll,
    savedScroll,
    target,
    computedScrollThreshold,
    onScroll,
  }
}

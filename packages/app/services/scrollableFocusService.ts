import { useResizeObserver } from '@vueuse/core'
import { computed, ref, toValue, type MaybeRefOrGetter } from 'vue'

/**
 * A region that scrolls must be reachable from the keyboard (WCAG 2.1.1), or its overflow cannot be read
 * without a mouse. Returns a `tabindex` that makes the element a Tab stop only while its content overflows.
 * The element and its direct children are observed, so content that grows inside a fixed-size box counts too.
 */
export const useScrollableFocusService = (element: MaybeRefOrGetter<HTMLElement | null | undefined>) => {
  const isScrollable = ref(false)

  const observedElements = computed(() => {
    const target = toValue(element)

    if (!target) {
      return []
    }

    const childElements = Array.from(target.children).filter((child) => child instanceof HTMLElement)

    return [target, ...childElements]
  })

  useResizeObserver(observedElements, () => {
    const target = toValue(element)

    isScrollable.value =
      !!target && (target.scrollHeight > target.clientHeight || target.scrollWidth > target.clientWidth)
  })

  const scrollableTabindex = computed(() => (isScrollable.value ? 0 : undefined))

  return {
    isScrollable,
    scrollableTabindex,
  }
}

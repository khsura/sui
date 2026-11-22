import { useEventListener, useMutationObserver, useResizeObserver } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watch, type Ref } from 'vue'
import {
  tabsScrollEdgeTolerance,
  tabsScrollerSelector,
  tabsScrollStepRatio,
  tabsSelectedTabSelector,
} from '@/app/constants'
import { getDocument, getHiddenScrollEdges, getScrollLeftToReveal } from '@/app/lib'

/**
 * STabs keeps its tabs on one row that scrolls sideways when they do not fit. This keeps the selected tab
 * scrolled into view, without scrolling the page: on mount, once the web fonts have loaded, and whenever the
 * selection changes. It also reports which ends of the row hide tabs, so STabs can show a scroll arrow and an
 * edge fade there, and scrolls the row by most of its width when an arrow is clicked.
 */
export const useTabsService = (selected: Ref<number | string>, element: Ref<HTMLElement | null | undefined>) => {
  const scroller = computed(() => element.value?.querySelector<HTMLElement>(tabsScrollerSelector) ?? null)
  const isStartHidden = ref(false)
  const isEndHidden = ref(false)

  const updateHiddenEdges = () => {
    const hiddenEdges = scroller.value
      ? getHiddenScrollEdges(scroller.value, tabsScrollEdgeTolerance)
      : { start: false, end: false }

    isStartHidden.value = hiddenEdges.start
    isEndHidden.value = hiddenEdges.end
  }

  const revealSelectedTab = () => {
    const selectedTab = scroller.value?.querySelector<HTMLElement>(tabsSelectedTabSelector)

    if (scroller.value && selectedTab) {
      scroller.value.scrollLeft = getScrollLeftToReveal(
        scroller.value.getBoundingClientRect(),
        selectedTab.getBoundingClientRect(),
        scroller.value.scrollLeft,
      )
    }

    updateHiddenEdges()
  }

  const scrollByStep = (direction: -1 | 1) => {
    scroller.value?.scrollBy({ left: direction * scroller.value.clientWidth * tabsScrollStepRatio, behavior: 'smooth' })
  }

  useEventListener(scroller, 'scroll', updateHiddenEdges, { passive: true })
  // The row overflows or fits again when the container resizes or tabs are added or removed.
  useResizeObserver(scroller, updateHiddenEdges)
  useMutationObserver(scroller, updateHiddenEdges, { childList: true, subtree: true, characterData: true })

  onMounted(() => {
    revealSelectedTab()
    // Labels get wider when a web font finishes loading, which can push the selected tab out of view again.
    void getDocument()?.fonts?.ready.then(revealSelectedTab)
  })
  watch(selected, () => nextTick(revealSelectedTab))

  return {
    isStartHidden,
    isEndHidden,
    revealSelectedTab,
    scrollBackward: () => scrollByStep(-1),
    scrollForward: () => scrollByStep(1),
  }
}

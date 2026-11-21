import { computed, nextTick, onMounted, watch, type Ref } from 'vue'
import { tabsScrollerSelector, tabsSelectedTabSelector } from '@/app/constants'
import { getDocument, getScrollLeftToReveal } from '@/app/lib'

/**
 * STabs keeps its tabs on one row that scrolls sideways when they do not fit. This keeps the selected tab
 * scrolled into view, without scrolling the page: on mount, once the web fonts have loaded, and whenever the
 * selection changes.
 */
export const useTabsService = (selected: Ref<number | string>, element: Ref<HTMLElement | null | undefined>) => {
  const scroller = computed(() => element.value?.querySelector<HTMLElement>(tabsScrollerSelector) ?? null)

  const revealSelectedTab = () => {
    const selectedTab = scroller.value?.querySelector<HTMLElement>(tabsSelectedTabSelector)

    if (!scroller.value || !selectedTab) {
      return
    }

    scroller.value.scrollLeft = getScrollLeftToReveal(
      scroller.value.getBoundingClientRect(),
      selectedTab.getBoundingClientRect(),
      scroller.value.scrollLeft,
    )
  }

  onMounted(() => {
    revealSelectedTab()
    // Labels get wider when a web font finishes loading, which can push the selected tab out of view again.
    void getDocument()?.fonts?.ready.then(revealSelectedTab)
  })
  watch(selected, () => nextTick(revealSelectedTab))

  return { revealSelectedTab }
}

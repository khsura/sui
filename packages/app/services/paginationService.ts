import { computed, nextTick, onMounted, ref, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import {
  paginationAllButtonCount,
  paginationCompactMaxVisible,
  paginationEllipsis,
  paginationFirstPage,
  paginationMinEllipsisSlots,
  paginationMinHiddenPages,
  paginationSlotSelector,
  paginationStepButtonCount,
} from '@/app/constants'
import type { PaginationItem, PaginationItemRange, PaginationRangeOptions } from '@/app/types'

const getRange = (start: number, count: number) => {
  return Array.from({ length: Math.max(0, count) }, (_, index) => start + index)
}

/** Number of pages needed for `itemsCount` rows at `itemsPerPage` rows a page. */
export const getPageCount = (itemsCount: number, itemsPerPage: number) => {
  return Math.ceil(itemsCount / itemsPerPage)
}

/** Keeps `page` (starting at 1) between the first and the last page. With no pages it returns the first page. */
export const clampPage = (page: number, pageCount: number) => {
  const wholePage = Number.isFinite(page) ? Math.floor(page) : paginationFirstPage

  return Math.max(paginationFirstPage, Math.min(wholePage, pageCount))
}

/** The rows that `page` (starting at 1) shows, such as `{ first: 11, last: 20 }`. */
export const getPageItemRange = (page: number, itemsPerPage: number, itemsCount: number): PaginationItemRange => {
  const offset = (page - 1) * itemsPerPage

  return {
    first: offset + 1,
    last: Math.min(offset + itemsPerPage, itemsCount),
  }
}

/**
 * The page list SPagination draws: exactly `totalVisible` slots (or every page, when they all fit), with the
 * first and last page kept and the gaps drawn as an ellipsis. An ellipsis always hides two pages or more.
 *
 * `{ page: 10, length: 20, totalVisible: 7 }` gives `[1, '…', 9, 10, 11, '…', 20]`.
 */
export const getPaginationItems = ({ page, length, totalVisible }: PaginationRangeOptions): PaginationItem[] => {
  const pageCount = Number.isFinite(length) ? Math.max(0, Math.floor(length)) : 0

  if (pageCount === 0) {
    return []
  }

  const current = clampPage(page, pageCount)
  const slots = Number.isFinite(totalVisible) ? Math.max(1, Math.floor(totalVisible)) : pageCount

  if (pageCount <= slots) {
    return getRange(paginationFirstPage, pageCount)
  }

  // Too few slots for "first, …, current, …, last": show a window of pages around the current one.
  if (slots < paginationMinEllipsisSlots) {
    const windowStart = Math.max(
      paginationFirstPage,
      Math.min(current - Math.floor((slots - 1) / 2), pageCount - slots + 1),
    )

    return getRange(windowStart, slots)
  }

  // "first, …, middle pages, …, last": the slots left for the middle window, centred on the current page.
  const middleCount = slots - (paginationMinEllipsisSlots - 1)
  const middleStart = current - Math.floor((middleCount - 1) / 2)
  const middleEnd = middleStart + middleCount - 1
  // Pages kept beside the only ellipsis when the current page is near one end.
  const edgeCount = slots - 2

  if (middleStart - (paginationFirstPage + 1) < paginationMinHiddenPages) {
    return [...getRange(paginationFirstPage, edgeCount), paginationEllipsis, pageCount]
  }

  if (pageCount - 1 - middleEnd < paginationMinHiddenPages) {
    return [paginationFirstPage, paginationEllipsis, ...getRange(pageCount - edgeCount + 1, edgeCount)]
  }

  return [paginationFirstPage, paginationEllipsis, ...getRange(middleStart, middleCount), paginationEllipsis, pageCount]
}

type PaginationServiceOptions = {
  page: MaybeRefOrGetter<number>
  length: MaybeRefOrGetter<number>
  totalVisible: MaybeRefOrGetter<number>
  /** `true` or `false` forces the mode; `undefined` turns compact mode on when the full list does not fit. */
  compact: MaybeRefOrGetter<boolean | null | undefined>
  showFirstLastPage: MaybeRefOrGetter<boolean | null | undefined>
  /** Changes that resize the page buttons, such as the `size` prop. They reset the measured width. */
  layoutKey: MaybeRefOrGetter<unknown>
}

/**
 * SPagination's state. It measures how many page slots fit in `element` and switches to compact mode (no
 * first/last buttons, at most five page slots) when the full list would overflow, so it never scrolls the page.
 */
export const usePaginationService = (options: PaginationServiceOptions, element: Readonly<Ref<HTMLElement | null>>) => {
  const { width: availableWidth } = useElementSize(element)
  const slotWidth = ref(0)
  const slotGap = ref(0)
  const pageCount = computed(() => Math.max(0, Math.floor(toValue(options.length) || 0)))
  const page = computed(() => clampPage(toValue(options.page), pageCount.value))
  const canGoBack = computed(() => page.value > paginationFirstPage)
  const canGoForward = computed(() => page.value < pageCount.value)

  // How many slots (buttons, pages and ellipses) fit in one row; Infinity until it has been measured.
  const slotsThatFit = computed(() => {
    if (availableWidth.value <= 0 || slotWidth.value <= 0) {
      return Number.POSITIVE_INFINITY
    }

    return Math.floor((availableWidth.value + slotGap.value) / (slotWidth.value + slotGap.value))
  })

  const fullButtonCount = computed(() => {
    return toValue(options.showFirstLastPage) ? paginationAllButtonCount : paginationStepButtonCount
  })

  const isCompact = computed(() => {
    const compact = toValue(options.compact)

    if (compact === true || compact === false) {
      return compact
    }

    const fullSlotCount = Math.min(toValue(options.totalVisible), pageCount.value) + fullButtonCount.value

    return slotsThatFit.value < fullSlotCount
  })

  const showFirstLast = computed(() => !!toValue(options.showFirstLastPage) && !isCompact.value)

  const visibleSlots = computed(() => {
    const totalVisible = toValue(options.totalVisible)

    if (!isCompact.value) {
      return totalVisible
    }

    return Math.max(
      1,
      Math.min(totalVisible, paginationCompactMaxVisible, slotsThatFit.value - paginationStepButtonCount),
    )
  })

  const items = computed(() => {
    return getPaginationItems({ page: page.value, length: pageCount.value, totalVisible: visibleSlots.value })
  })

  const measure = () => {
    const slots = [...(element.value?.querySelectorAll<HTMLElement>(paginationSlotSelector) ?? [])]
    const list = slots[0]?.parentElement

    if (!list) {
      return
    }

    // Only grows, so a narrower set of page numbers cannot flip the mode back and forth.
    slotWidth.value = Math.max(slotWidth.value, ...slots.map((slot) => slot.offsetWidth))
    slotGap.value = Number.parseFloat(getComputedStyle(list).columnGap) || 0
  }

  onMounted(measure)
  watch(items, () => nextTick(measure))
  watch([() => toValue(options.layoutKey), pageCount], () => {
    slotWidth.value = 0
    void nextTick(measure)
  })

  return {
    page,
    pageCount,
    items,
    isCompact,
    showFirstLast,
    canGoBack,
    canGoForward,
  }
}

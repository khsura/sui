import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { paginationEllipsis } from '@/app/constants'
import { clampPage, getPageCount, getPageItemRange, getPaginationItems, usePaginationService } from '@/app/services'

const gap = paginationEllipsis

describe('getPaginationItems', () => {
  test('returns no slots when there are no pages', () => {
    expect(getPaginationItems({ page: 1, length: 0, totalVisible: 7 })).toEqual([])
    expect(getPaginationItems({ page: 1, length: Number.NaN, totalVisible: 7 })).toEqual([])
  })

  test('lists every page when they all fit', () => {
    expect(getPaginationItems({ page: 2, length: 5, totalVisible: 7 })).toEqual([1, 2, 3, 4, 5])
    expect(getPaginationItems({ page: 7, length: 7, totalVisible: 7 })).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  test.each([
    [1, [1, 2, 3, 4, 5, gap, 20]],
    [4, [1, 2, 3, 4, 5, gap, 20]],
    [5, [1, gap, 4, 5, 6, gap, 20]],
    [10, [1, gap, 9, 10, 11, gap, 20]],
    [16, [1, gap, 15, 16, 17, gap, 20]],
    [17, [1, gap, 16, 17, 18, 19, 20]],
    [20, [1, gap, 16, 17, 18, 19, 20]],
  ])('7 slots of 20 pages, page %i', (page, expected) => {
    expect(getPaginationItems({ page, length: 20, totalVisible: 7 })).toEqual(expected)
  })

  test.each([
    [4, [1, 2, 3, 4, 5, 6, gap, 20]],
    [5, [1, gap, 4, 5, 6, 7, gap, 20]],
    [6, [1, gap, 5, 6, 7, 8, gap, 20]],
    [15, [1, gap, 14, 15, 16, 17, gap, 20]],
    [16, [1, gap, 15, 16, 17, 18, 19, 20]],
  ])('an even number of slots (8), page %i', (page, expected) => {
    expect(getPaginationItems({ page, length: 20, totalVisible: 8 })).toEqual(expected)
  })

  test.each([
    [3, [1, 2, 3, gap, 20]],
    [4, [1, gap, 4, gap, 20]],
    [17, [1, gap, 17, gap, 20]],
    [18, [1, gap, 18, 19, 20]],
  ])('the smallest ellipsis layout (5 slots), page %i', (page, expected) => {
    expect(getPaginationItems({ page, length: 20, totalVisible: 5 })).toEqual(expected)
  })

  test('never lets an ellipsis stand for a single page', () => {
    for (let totalVisible = 5; totalVisible <= 11; totalVisible++) {
      for (let page = 1; page <= 30; page++) {
        const items = getPaginationItems({ page, length: 30, totalVisible })

        expect(items).toHaveLength(totalVisible)
        expect(items).toContain(page)
        items.forEach((item, index) => {
          if (item === gap) {
            const before = items[index - 1]
            const after = items[index + 1]

            expect(typeof before === 'number' && typeof after === 'number' && after - before > 2).toBe(true)
          }
        })
      }
    }
  })

  test('shows a window of pages, without ellipses, below 5 slots', () => {
    expect(getPaginationItems({ page: 10, length: 20, totalVisible: 3 })).toEqual([9, 10, 11])
    expect(getPaginationItems({ page: 1, length: 20, totalVisible: 4 })).toEqual([1, 2, 3, 4])
    expect(getPaginationItems({ page: 20, length: 20, totalVisible: 4 })).toEqual([17, 18, 19, 20])
    expect(getPaginationItems({ page: 6, length: 20, totalVisible: 1 })).toEqual([6])
  })

  test('clamps the page and rounds the inputs down', () => {
    expect(getPaginationItems({ page: 99, length: 20, totalVisible: 7 })).toEqual([1, gap, 16, 17, 18, 19, 20])
    expect(getPaginationItems({ page: -3, length: 3.7, totalVisible: 7.9 })).toEqual([1, 2, 3])
  })
})

describe('pagination helpers', () => {
  test('getPageCount rounds up', () => {
    expect(getPageCount(0, 10)).toBe(0)
    expect(getPageCount(95, 10)).toBe(10)
    expect(getPageCount(100, 10)).toBe(10)
  })

  test('clampPage keeps the page in range', () => {
    expect(clampPage(0, 5)).toBe(1)
    expect(clampPage(7, 5)).toBe(5)
    expect(clampPage(3, 5)).toBe(3)
    expect(clampPage(2.6, 5)).toBe(2)
    expect(clampPage(Number.NaN, 5)).toBe(1)
    expect(clampPage(4, 0)).toBe(1)
  })

  test('getPageItemRange gives the rows of a page', () => {
    expect(getPageItemRange(1, 10, 95)).toEqual({ first: 1, last: 10 })
    expect(getPageItemRange(10, 10, 95)).toEqual({ first: 91, last: 95 })
    expect(getPageItemRange(1, 10, 0)).toEqual({ first: 1, last: 0 })
  })
})

describe('usePaginationService', () => {
  const mountService = (options: { compact?: boolean; showFirstLastPage?: boolean } = {}) => {
    const page = ref(1)
    const length = ref(20)
    let service: ReturnType<typeof usePaginationService> | undefined

    const Host = defineComponent({
      setup() {
        const element = ref<HTMLElement | null>(null)

        service = usePaginationService(
          {
            page,
            length,
            totalVisible: 7,
            compact: options.compact,
            showFirstLastPage: options.showFirstLastPage ?? true,
            layoutKey: 'default',
          },
          element,
        )

        return () => h('nav', { ref: element })
      },
    })

    mount(Host)

    if (!service) {
      throw new Error('usePaginationService did not run')
    }

    return { service, page, length }
  }

  test('clamps the page and reports which steps are possible', async () => {
    const { service, page } = mountService()

    expect(service.canGoBack.value).toBe(false)
    expect(service.canGoForward.value).toBe(true)

    page.value = 40
    await nextTick()

    expect(service.page.value).toBe(20)
    expect(service.canGoBack.value).toBe(true)
    expect(service.canGoForward.value).toBe(false)
  })

  test('is not compact before it can measure (jsdom has no layout)', () => {
    const { service } = mountService()

    expect(service.isCompact.value).toBe(false)
    expect(service.showFirstLast.value).toBe(true)
    expect(service.items.value).toHaveLength(7)
  })

  test('forced compact mode hides first/last and shows at most 5 slots', () => {
    const { service } = mountService({ compact: true })

    expect(service.isCompact.value).toBe(true)
    expect(service.showFirstLast.value).toBe(false)
    expect(service.items.value).toEqual([1, 2, 3, gap, 20])
  })

  test('has no pages for a zero length', async () => {
    const { service, length } = mountService()

    length.value = 0
    await nextTick()

    expect(service.items.value).toEqual([])
    expect(service.canGoForward.value).toBe(false)
  })
})

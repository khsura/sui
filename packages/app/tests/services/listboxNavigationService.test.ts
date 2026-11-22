import { listboxNoActiveIndex } from '@/app/constants'
import { useListboxNavigationService } from '@/app/services'

// Options 0..4, where 1 and 4 are disabled.
const disabledIndexes = new Set([1, 4])

const setup = () =>
  useListboxNavigationService({
    idPrefix: 'fruit',
    getOptionCount: () => 5,
    getIsOptionDisabled: (index) => disabledIndexes.has(index),
  })

describe('useListboxNavigationService', () => {
  test('starts with no highlighted option and builds stable ids', () => {
    const { activeIndex, activeOptionId, listboxId, getOptionId } = setup()

    expect(activeIndex.value).toBe(listboxNoActiveIndex)
    expect(activeOptionId.value).toBeUndefined()
    expect(listboxId.value).toBe('fruit-listbox')
    expect(getOptionId(2)).toBe('fruit-option-2')
  })

  test('moves down from nothing to the first option and skips disabled ones', () => {
    const { activeIndex, activeOptionId, moveActive } = setup()

    moveActive(1)
    expect(activeIndex.value).toBe(0)

    moveActive(1)
    expect(activeIndex.value).toBe(2)
    expect(activeOptionId.value).toBe('fruit-option-2')
  })

  test('stops at the last enabled option instead of wrapping', () => {
    const { activeIndex, moveActive, setActiveIndex } = setup()

    setActiveIndex(3)
    moveActive(1)

    expect(activeIndex.value).toBe(3)
  })

  test('moves up from nothing to the last enabled option', () => {
    const { activeIndex, moveActive } = setup()

    moveActive(-1)

    expect(activeIndex.value).toBe(3)
  })

  test('jumps to the first and last enabled options and resets', () => {
    const { activeIndex, moveToFirst, moveToLast, resetActiveIndex } = setup()

    moveToLast()
    expect(activeIndex.value).toBe(3)

    moveToFirst()
    expect(activeIndex.value).toBe(0)

    resetActiveIndex()
    expect(activeIndex.value).toBe(listboxNoActiveIndex)
  })
})

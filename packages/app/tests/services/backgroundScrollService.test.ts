import { effectScope } from 'vue'
import { overlayScrollBlockedClassName } from '@/app/constants'
import { useBackgroundScrollService } from '@/app/services'
import { scrollLockOwners } from '@/app/store'

const html = document.documentElement
const isPageLocked = () => html.classList.contains(overlayScrollBlockedClassName)

describe('useBackgroundScrollService', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
  })

  afterEach(() => {
    scrollLockOwners.clear()
    html.classList.remove(overlayScrollBlockedClassName)
    html.removeAttribute('style')
    vi.restoreAllMocks()
  })

  test('locks the page and unlocks it back to the pinned scroll position', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined)
    const { disableBackgroundScroll, enableBackgroundScroll } = useBackgroundScrollService()

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(120)
    disableBackgroundScroll()

    expect(isPageLocked()).toBe(true)
    expect(html.style.getPropertyValue('--s-body-scroll-y')).toBe('-120px')

    enableBackgroundScroll()

    expect(isPageLocked()).toBe(false)
    expect(html.style.getPropertyValue('--s-body-scroll-y')).toBe('')
    expect(scrollTo).toHaveBeenCalledWith({ left: 0, top: 120, behavior: 'instant' })
  })

  // A drawer crossing the md breakpoint: its watcher locks (mobile and still open), then it closes in the same tick.
  test('a lock and an unlock from the same owner in one tick leave the page unlocked', async () => {
    const { disableBackgroundScroll, enableBackgroundScroll } = useBackgroundScrollService()

    disableBackgroundScroll()
    enableBackgroundScroll()
    await Promise.resolve()

    expect(isPageLocked()).toBe(false)
  })

  test('repeated locks from one owner are released by a single unlock', () => {
    const { disableBackgroundScroll, enableBackgroundScroll } = useBackgroundScrollService()

    disableBackgroundScroll()
    disableBackgroundScroll()
    enableBackgroundScroll()

    expect(isPageLocked()).toBe(false)
  })

  test('the page stays locked until the last owner lets go', () => {
    const dialog = useBackgroundScrollService()
    const drawer = useBackgroundScrollService()

    dialog.disableBackgroundScroll()
    drawer.disableBackgroundScroll()
    dialog.enableBackgroundScroll()

    expect(isPageLocked()).toBe(true)

    drawer.enableBackgroundScroll()

    expect(isPageLocked()).toBe(false)
  })

  test('an owner that never locked cannot unlock another owner', () => {
    const dialog = useBackgroundScrollService()
    const drawer = useBackgroundScrollService()

    dialog.disableBackgroundScroll()
    drawer.enableBackgroundScroll()

    expect(isPageLocked()).toBe(true)
  })

  // SSR: the owner registry is module state, so a server render must never register in it.
  test('without a window, locking and unlocking leave the owner registry empty', () => {
    const { disableBackgroundScroll, enableBackgroundScroll } = useBackgroundScrollService()

    vi.stubGlobal('window', undefined)

    try {
      disableBackgroundScroll()

      expect(scrollLockOwners.size).toBe(0)

      enableBackgroundScroll()

      expect(scrollLockOwners.size).toBe(0)
    } finally {
      vi.unstubAllGlobals()
    }

    expect(isPageLocked()).toBe(false)
  })

  // Switching Storybook stories (or routes) unmounts an open mobile drawer without closing it first.
  test('an owner releases its lock when its scope is disposed', () => {
    const scope = effectScope()

    scope.run(() => {
      useBackgroundScrollService().disableBackgroundScroll()
    })

    expect(isPageLocked()).toBe(true)

    scope.stop()

    expect(isPageLocked()).toBe(false)
  })
})

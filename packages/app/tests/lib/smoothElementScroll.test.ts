import { smoothElementScroll } from '../../lib/scroll'

const safariUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'

// More frames than one 0.3s animation at 60fps.
const framesToFinish = 40
const framesBeforeSecondScroll = 5

// A scroller whose browser keeps whole-pixel positions, as WebKit does for `scrollLeft`.
const createScroller = (scrollWidth: number) => {
  let scrollLeft = 0
  const element = document.createElement('div')

  Object.defineProperty(element, 'scrollLeft', { get: () => scrollLeft })
  element.scroll = (options?: ScrollToOptions | number) => {
    const left = typeof options === 'object' ? options.left : undefined

    if (left !== undefined) {
      scrollLeft = Math.max(0, Math.min(Math.round(left), scrollWidth))
    }
  }

  return element
}

describe('smoothElementScroll (Safari polyfill)', () => {
  let pendingFrames: FrameRequestCallback[] = []

  const runFrames = (count: number) => {
    for (let frame = 0; frame < count; frame++) {
      const callbacks = pendingFrames

      pendingFrames = []
      callbacks.forEach((callback) => callback(frame))
    }
  }

  beforeEach(() => {
    pendingFrames = []
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(safariUserAgent)
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => pendingFrames.push(callback))
    vi.stubGlobal('cancelAnimationFrame', (frameId: number) => {
      pendingFrames[frameId - 1] = () => undefined
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('lands exactly on the target although the browser rounds each position', () => {
    const scroller = createScroller(2000)

    smoothElementScroll(scroller, { left: 1043, behavior: 'smooth' })
    runFrames(framesToFinish)

    expect(scroller.scrollLeft).toBe(1043)
  })

  test('a scroll started mid-animation replaces the running one', () => {
    const scroller = createScroller(2000)

    smoothElementScroll(scroller, { left: 1000, behavior: 'smooth' })
    runFrames(framesBeforeSecondScroll)
    smoothElementScroll(scroller, { left: 0, behavior: 'smooth' })
    runFrames(framesToFinish)

    expect(scroller.scrollLeft).toBe(0)
  })
})

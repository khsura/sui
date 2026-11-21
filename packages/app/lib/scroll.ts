import { getDocument, getUserAgent, getWindow, hasScrollFeature } from './browser'

declare global {
  interface Window {
    mozRequestAnimationFrame?: typeof window.requestAnimationFrame
    webkitRequestAnimationFrame?: typeof window.requestAnimationFrame
    msRequestAnimationFrame?: typeof window.requestAnimationFrame
    mozCancelAnimationFrame?: typeof window.cancelAnimationFrame
  }
}

const smoothAnimationSeconds = 0.3
const framePerSeconds = 60
const totalAnimations = smoothAnimationSeconds * framePerSeconds

const getElement = (element: string | HTMLElement | null) => {
  if (typeof element === 'string') {
    return getDocument()?.querySelector<HTMLElement>(element) ?? null
  }

  return element
}

const getAnimationFrame = () => {
  const window = getWindow()

  if (!window) {
    return null
  }

  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame

  const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame

  return {
    requestAnimationFrame,
    cancelAnimationFrame,
  }
}

export const scrollIntoView = (el: string | HTMLElement | null, options?: ScrollToOptions | undefined) => {
  if (!hasScrollFeature()) {
    return
  }

  const element = getElement(el)

  if (!element) {
    return
  }

  element.scrollIntoView(options)
}

/** @description for safari */
const smoothVerticalScrollPolyfill = ({ pixelsToScroll }: { pixelsToScroll: number }) => {
  const frame = getAnimationFrame()

  if (!frame) {
    return
  }

  let animationFrame: number | undefined
  let time = 0
  const { requestAnimationFrame, cancelAnimationFrame } = frame
  const pixelsPerStep = pixelsToScroll / totalAnimations

  const step = () => {
    getWindow()?.scrollBy(0, pixelsPerStep)
    animationFrame = requestAnimationFrame(step)
    time += 1
    if (time >= totalAnimations) {
      cancelAnimationFrame(animationFrame)
    }
  }

  animationFrame = requestAnimationFrame(step)
}

export const smoothScrollTo = (el: HTMLElement | string | null, options?: { offsetTop?: number }) => {
  const element = getElement(el)

  if (!element) {
    return
  }

  const elementBoundingTop = element.getBoundingClientRect().top
  const pixelsToScroll = elementBoundingTop - (options?.offsetTop ?? 0)
  const document = getDocument()
  const window = getWindow()

  if (document && 'scrollBehavior' in document.documentElement.style) {
    window?.scrollBy({
      top: pixelsToScroll,
      behavior: 'smooth',
    })

    return
  }

  smoothVerticalScrollPolyfill({
    pixelsToScroll,
  })
}

// The running polyfill animation of each element, so a new scroll replaces it instead of adding its steps to it.
const elementScrollAnimationFrames = new WeakMap<HTMLElement, number>()

/**
 * @description for safari. Each frame is placed on the line from the start to the target position, and the last
 * frame lands exactly on the target. Stepping from the element's current (browser-rounded) position, with two
 * overlapping animations both adding their steps, used to stop the element several pixels off its target.
 */
const smoothElementScrollPolyfill = (element: HTMLElement, options?: ScrollToOptions | undefined) => {
  const runningAnimationFrame = elementScrollAnimationFrames.get(element)

  if (runningAnimationFrame !== undefined) {
    cancelAnimationFrame(runningAnimationFrame)
  }

  const startLeft = element.scrollLeft
  const startTop = element.scrollTop
  let frame = 0

  const step = () => {
    frame += 1
    const progress = Math.min(frame / totalAnimations, 1)

    element.scroll({
      ...(options?.top !== undefined ? { top: startTop + (options.top - startTop) * progress } : {}),
      ...(options?.left !== undefined ? { left: startLeft + (options.left - startLeft) * progress } : {}),
    })

    if (progress < 1) {
      elementScrollAnimationFrames.set(element, requestAnimationFrame(step))
    } else {
      elementScrollAnimationFrames.delete(element)
    }
  }

  elementScrollAnimationFrames.set(element, requestAnimationFrame(step))
}

export const smoothElementScroll = (element: HTMLElement | null, options?: ScrollToOptions | undefined) => {
  if (!element) {
    return
  }

  if (hasScrollFeature() && !/^((?!chrome|android).)*safari/i.test(getUserAgent() ?? '')) {
    element.scroll(options)

    return
  }

  smoothElementScrollPolyfill(element, options)
}

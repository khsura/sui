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

/** @description for safari */
const smoothElementScrollPolyfill = (element: HTMLElement, options?: ScrollToOptions | undefined) => {
  let animationFrame: number | undefined
  let time = 0
  const stepLeftPerFrame = ((options?.left ?? 0) - element.scrollLeft) / totalAnimations
  const stepTopPerFrame = ((options?.top ?? 0) - element.scrollTop) / totalAnimations

  const step = () => {
    element.scroll({
      ...(options?.top !== undefined ? { top: element.scrollTop + stepTopPerFrame } : {}),
      ...(options?.left !== undefined ? { left: element.scrollLeft + stepLeftPerFrame } : {}),
    })
    animationFrame = requestAnimationFrame(step)
    time += 1
    if (time >= totalAnimations) {
      cancelAnimationFrame(animationFrame)
    }
  }

  animationFrame = requestAnimationFrame(step)
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

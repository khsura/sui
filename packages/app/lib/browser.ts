import { cssVariables } from '@khsura/sui/constants'
import { z } from 'zod'

export const getDocument = () => {
  return typeof document !== 'undefined' ? document : null
}

export const getWindow = () => {
  return typeof window !== 'undefined' ? window : null
}

export const querySelector = (selectors: keyof HTMLElementTagNameMap) => {
  return getDocument()?.querySelector(selectors) ?? null
}

export const hasScrollFeature = () => {
  const doc = getDocument()

  if (!doc) {
    return false
  }

  return 'scrollBehavior' in doc.documentElement.style
}

export const getNavigator = () => {
  return typeof navigator !== 'undefined' ? navigator : null
}

export const getUserAgent = () => {
  return getNavigator()?.userAgent ?? null
}

export const hasDragDropFeature = () => {
  const div = getDocument()?.createElement('div')

  if (!div) {
    return false
  }

  return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div)
}

export const isBrowser = () => {
  return typeof window !== 'undefined'
}

export interface ViewportLocation {
  left: number
  top: number
  width: number
  height: number
  right: number
  bottom: number
  isWithinOverlay: boolean
}

export const getViewportLocation = () => {
  const document = getDocument()
  const window = getWindow()
  const html = window?.document.querySelector<HTMLElement>('html')

  if (!document || !window || !html) {
    return null
  }

  const isWithinOverlay = html.classList.contains('s_overlay__scrollBlocked')

  const scrollXProperty = z.coerce
    .number()
    .parse(html.style.getPropertyValue(cssVariables.bodyScrollX).replace('px', ''))

  const scrollYProperty = z.coerce
    .number()
    .parse(html.style.getPropertyValue(cssVariables.bodyScrollY).replace('px', ''))

  const left = isWithinOverlay ? -scrollXProperty : document.documentElement.scrollLeft
  const top = isWithinOverlay ? -scrollYProperty : document.documentElement.scrollTop
  const width = window.innerWidth
  const height = window.innerHeight

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    isWithinOverlay,
  } satisfies ViewportLocation
}

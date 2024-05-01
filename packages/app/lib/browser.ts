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
}

export const getViewportLocation = () => {
  const document = getDocument()
  const window = getWindow()

  if (!document || !window) {
    return null
  }

  const left = document.documentElement.scrollLeft
  const top = document.documentElement.scrollTop
  const width = window.innerWidth
  const height = window.innerHeight

  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  } satisfies ViewportLocation
}

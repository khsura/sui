import { getDocument, getWindow } from '~/lib'
import { store } from '~/store'

const getClientWidth = () => {
  const document = getDocument()
  const window = getWindow()

  if (document === null || window === null) {
    return 0
  }

  return Math.max(document.documentElement?.clientWidth ?? 0, window.innerWidth ?? 0)
}

const getClientHeight = () => {
  const document = getDocument()
  const window = getWindow()

  if (document === null || window === null) {
    return 0
  }

  return Math.max(document.documentElement?.clientHeight ?? 0, window.innerHeight ?? 0)
}

const updateDisplay = () => {
  const height = getClientHeight()
  const width = getClientWidth()

  store.height = height
  store.width = width
}

let resizeTimeout = 0

const onResize = () => {
  clearTimeout(resizeTimeout)
  const window = getWindow()

  if (window) {
    resizeTimeout = window.setTimeout(() => {
      updateDisplay()
    }, 100)
  }
}

export const listenDisplayChange = () => {
  if (store.isReady) {
    return
  }

  const window = getWindow()

  if (window === null) {
    return
  }

  updateDisplay()

  window.addEventListener(
    'resize',
    () => {
      onResize()
    },
    { passive: true },
  )
}

import { getDocument, getWindow } from '@sui/app/lib'
import { type AppState } from '@sui/app/types'

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

const updateDisplay = (config: AppState) => {
  const height = getClientHeight()
  const width = getClientWidth()

  config.display.height = height
  config.display.width = width
}

let resizeTimeout = 0

const onResize = (config: AppState) => {
  clearTimeout(resizeTimeout)
  const window = getWindow()

  if (window) {
    resizeTimeout = window.setTimeout(() => {
      updateDisplay(config)
    }, 100)
  }
}

export const listenDisplayChange = (config: AppState) => {
  const window = getWindow()

  if (window === null) {
    return
  }

  updateDisplay(config)

  window.addEventListener(
    'resize',
    () => {
      onResize(config)
    },
    { passive: true },
  )
}

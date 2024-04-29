export interface TouchHandlers {
  start?: ((wrapperEvent: TouchEvent & TouchWrapper) => void) | undefined
  end?: ((wrapperEvent: TouchEvent & TouchWrapper) => void) | undefined
  move?: ((wrapperEvent: TouchEvent & TouchWrapper) => void) | undefined
  left?: ((wrapper: TouchWrapper) => void) | undefined
  right?: ((wrapper: TouchWrapper) => void) | undefined
  up?: ((wrapper: TouchWrapper) => void) | undefined
  down?: ((wrapper: TouchWrapper) => void) | undefined
}

export interface TouchStoredHandlers {
  touchstart: (e: TouchEvent) => void
  touchend: (e: TouchEvent) => void
  touchmove: (e: TouchEvent) => void
}

export type TouchValue = TouchHandlers & {
  parent?: boolean
  options?: AddEventListenerOptions
}

export interface TouchWrapper extends TouchHandlers {
  touchstartX: number
  touchstartY: number
  touchmoveX: number
  touchmoveY: number
  touchendX: number
  touchendY: number
  offsetX: number
  offsetY: number
}

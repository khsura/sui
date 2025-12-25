import { touchend, touchmove, touchstart } from '@/app/repositories/touchRepository'
import { type TouchHandlers, type TouchStoredHandlers, type TouchWrapper } from '@/app/types'

export const useTouchService = (value?: TouchHandlers | undefined): TouchStoredHandlers => {
  const wrapper: TouchWrapper = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: value?.left,
    right: value?.right,
    up: value?.up,
    down: value?.down,
    start: value?.start,
    move: value?.move,
    end: value?.end,
  }

  return {
    touchstart: (e: TouchEvent) => {
      touchstart(e, wrapper)
    },
    touchend: (e: TouchEvent) => {
      touchend(e, wrapper)
    },
    touchmove: (e: TouchEvent) => {
      touchmove(e, wrapper)
    },
  }
}

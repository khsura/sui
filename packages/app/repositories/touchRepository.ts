import { type TouchWrapper } from '@/app/types'

const handleGesture = (wrapper: TouchWrapper) => {
  const { touchstartX, touchendX, touchstartY, touchendY } = wrapper
  const dirRatio = 0.5
  const minDistance = 16

  wrapper.offsetX = touchendX - touchstartX
  wrapper.offsetY = touchendY - touchstartY

  if (Math.abs(wrapper.offsetY) < dirRatio * Math.abs(wrapper.offsetX)) {
    if (wrapper.left && touchendX < touchstartX - minDistance) {
      wrapper.left(wrapper)
    }

    if (wrapper.right && touchendX > touchstartX + minDistance) {
      wrapper.right(wrapper)
    }
  }

  if (Math.abs(wrapper.offsetX) < dirRatio * Math.abs(wrapper.offsetY)) {
    if (wrapper.up && touchendY < touchstartY - minDistance) {
      wrapper.up(wrapper)
    }

    if (wrapper.down && touchendY > touchstartY + minDistance) {
      wrapper.down(wrapper)
    }
  }
}

export const touchend = (event: TouchEvent, wrapper: TouchWrapper) => {
  const touch = event.changedTouches[0]

  wrapper.touchendX = touch.clientX
  wrapper.touchendY = touch.clientY

  wrapper.end?.(Object.assign(event, wrapper))

  handleGesture(wrapper)
}

export const touchmove = (event: TouchEvent, wrapper: TouchWrapper) => {
  const touch = event.changedTouches[0]

  wrapper.touchmoveX = touch.clientX
  wrapper.touchmoveY = touch.clientY

  wrapper.move?.(Object.assign(event, wrapper))
}

export const touchstart = (event: TouchEvent, wrapper: TouchWrapper) => {
  const touch = event.changedTouches[0]

  wrapper.touchstartX = touch.clientX
  wrapper.touchstartY = touch.clientY

  wrapper.start?.(Object.assign(event, wrapper))
}

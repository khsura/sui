import { type Ref, computed, onScopeDispose, ref, watch } from 'vue'
import {
  navigationDrawerDefaultWidth,
  navigationDrawerResizeKeyboardStep,
  navigationDrawerResizeMaxWidth,
  navigationDrawerResizeMinWidth,
} from '@/app/constants'
import type { PropsNavigationDrawer } from '@/app/definitions'

const toDrawerWidth = (width: PropsNavigationDrawer['width']) => {
  const numericWidth = Number(width)

  return Number.isNaN(numericWidth) ? navigationDrawerDefaultWidth : numericWidth
}

export const useNavigationDrawerResizeService = (
  props: PropsNavigationDrawer,
  drawerElement: Ref<HTMLElement | null>,
  isRight: Readonly<Ref<boolean | undefined>>,
  isEnabled: Readonly<Ref<boolean>>,
  onResizeEnd: (width: number) => void,
) => {
  const width = ref(toDrawerWidth(props.width))
  const isResizing = ref(false)
  const minWidth = computed(() => props.minWidth ?? navigationDrawerResizeMinWidth)
  const maxWidth = computed(() => props.maxWidth ?? navigationDrawerResizeMaxWidth)

  const clampWidth = (nextWidth: number) => {
    return Math.round(Math.min(Math.max(nextWidth, minWidth.value), maxWidth.value))
  }

  const resizeToPointer = (event: PointerEvent) => {
    if (!drawerElement.value) {
      return
    }

    const drawerRect = drawerElement.value.getBoundingClientRect()
    const pointerWidth = isRight.value ? drawerRect.right - event.clientX : event.clientX - drawerRect.left

    width.value = clampWidth(pointerWidth)
  }

  const stopResize = () => {
    window.removeEventListener('pointermove', resizeToPointer)
    window.removeEventListener('pointerup', stopResize)
    window.removeEventListener('pointercancel', stopResize)

    if (!isResizing.value) {
      return
    }

    isResizing.value = false
    onResizeEnd(width.value)
  }

  const startResize = (event: PointerEvent) => {
    if (!isEnabled.value) {
      return
    }

    // stops the browser from selecting page text while dragging
    event.preventDefault()
    isResizing.value = true
    window.addEventListener('pointermove', resizeToPointer)
    window.addEventListener('pointerup', stopResize)
    window.addEventListener('pointercancel', stopResize)
  }

  const resizeByKeyboard = (event: KeyboardEvent) => {
    if (!isEnabled.value || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) {
      return
    }

    event.preventDefault()

    // the handle sits on the inner edge, so the arrow pointing away from the drawer's side grows it
    const growKey = isRight.value ? 'ArrowLeft' : 'ArrowRight'
    const step = event.key === growKey ? navigationDrawerResizeKeyboardStep : -navigationDrawerResizeKeyboardStep

    width.value = clampWidth(width.value + step)
    onResizeEnd(width.value)
  }

  watch(
    () => props.width,
    (nextWidth) => {
      width.value = toDrawerWidth(nextWidth)
    },
  )

  onScopeDispose(stopResize)

  return {
    width,
    minWidth,
    maxWidth,
    isResizing,
    startResize,
    resizeByKeyboard,
  }
}

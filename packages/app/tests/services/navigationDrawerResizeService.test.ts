import { type EffectScope, effectScope, nextTick, reactive, ref } from 'vue'
import {
  navigationDrawerResizeKeyboardStep,
  navigationDrawerResizeMaxWidth,
  navigationDrawerResizeMinWidth,
} from '@/app/constants'
import { type PropsNavigationDrawer } from '@/app/definitions'
import { useNavigationDrawerResizeService } from '@/app/services'

const drawerRectWidth = 1000

describe('useNavigationDrawerResizeService', () => {
  let scope: EffectScope

  const setup = (props: PropsNavigationDrawer, isRightValue = false, isEnabledValue = true) => {
    const drawerElement = document.createElement('div')

    vi.spyOn(drawerElement, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, drawerRectWidth, 800))

    const onResizeEnd = vi.fn()
    const isEnabled = ref(isEnabledValue)

    const service = scope.run(() =>
      useNavigationDrawerResizeService(props, ref(drawerElement), ref(isRightValue), isEnabled, onResizeEnd),
    )

    if (!service) {
      throw new Error('resize service was not created')
    }

    return { service, onResizeEnd, isEnabled }
  }

  const drag = (startResize: (event: PointerEvent) => void, clientX: number) => {
    startResize(new PointerEvent('pointerdown', { clientX: 0 }))
    window.dispatchEvent(new PointerEvent('pointermove', { clientX }))
    window.dispatchEvent(new PointerEvent('pointerup', { clientX }))
  }

  beforeEach(() => {
    scope = effectScope()
  })

  afterEach(() => {
    scope.stop()
    vi.restoreAllMocks()
  })

  test('uses the width prop as the starting width', () => {
    const { service } = setup({ width: 320 })

    expect(service.width.value).toBe(320)
  })

  test('a left drawer grows to the pointer measured from its left edge', () => {
    const { service, onResizeEnd } = setup({ width: 256 })

    drag(service.startResize, 400)

    expect(service.width.value).toBe(400)
    expect(onResizeEnd).toHaveBeenCalledWith(400)
    expect(service.isResizing.value).toBe(false)
  })

  test('a right drawer grows to the pointer measured from its right edge', () => {
    const { service } = setup({ width: 256 }, true)

    drag(service.startResize, 700)

    expect(service.width.value).toBe(drawerRectWidth - 700)
  })

  test('clamps the dragged width to the default min and max', () => {
    const { service } = setup({ width: 256 })

    drag(service.startResize, 10)
    expect(service.width.value).toBe(navigationDrawerResizeMinWidth)

    drag(service.startResize, drawerRectWidth)
    expect(service.width.value).toBe(navigationDrawerResizeMaxWidth)
  })

  test('clamps the dragged width to custom minWidth and maxWidth', () => {
    const { service } = setup({ width: 300, minWidth: 280, maxWidth: 360 })

    drag(service.startResize, 100)
    expect(service.width.value).toBe(280)

    drag(service.startResize, 900)
    expect(service.width.value).toBe(360)
  })

  test('ignores dragging while disabled', () => {
    const { service, onResizeEnd } = setup({ width: 256 }, false, false)

    drag(service.startResize, 400)

    expect(service.width.value).toBe(256)
    expect(onResizeEnd).not.toHaveBeenCalled()
  })

  test('stops following the pointer after pointerup', () => {
    const { service } = setup({ width: 256 })

    drag(service.startResize, 400)
    window.dispatchEvent(new PointerEvent('pointermove', { clientX: 500 }))

    expect(service.width.value).toBe(400)
  })

  test('the arrow pointing away from the drawer side grows it', () => {
    const left = setup({ width: 300 })
    const right = setup({ width: 300 }, true)

    left.service.resizeByKeyboard(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    right.service.resizeByKeyboard(new KeyboardEvent('keydown', { key: 'ArrowRight' }))

    expect(left.service.width.value).toBe(300 + navigationDrawerResizeKeyboardStep)
    expect(right.service.width.value).toBe(300 - navigationDrawerResizeKeyboardStep)
    expect(left.onResizeEnd).toHaveBeenCalledWith(300 + navigationDrawerResizeKeyboardStep)
  })

  test('follows later width prop changes', async () => {
    const props = reactive<PropsNavigationDrawer>({ width: 256 })
    const { service } = setup(props)

    props.width = 480
    await nextTick()

    expect(service.width.value).toBe(480)
  })
})

import { type PropsMenu } from '@sui/app/definitions'
import { getCleanSetObject, getNumericCssAttribute } from '@sui/app/lib'
import { getDocument, getViewportLocation, getWindow } from '@sui/app/lib/browser'
import { type MenuContentStyle } from '@sui/app/types'
import { type Ref, computed, ref } from 'vue'
import { useActivatorService, useContentService, useLocationService } from './core'
import { usePositionService } from './positionService'

export const useMenuService = (
  props: PropsMenu,
  model: Ref<boolean | null | undefined>,
  options?: {
    noContentMinWidth?: boolean
    offset?: number
    alignMiddle?: boolean
    onChange?: (v: boolean | undefined | null) => void
  },
) => {
  const { isRight, isLeft, isBottom, isTop } = useLocationService(props)
  const offset = options?.offset ?? 0
  const content = useContentService(props)
  const top = ref(0)
  const left = ref(0)
  const minWidth = ref<number | null>(null)
  const activatorService = useActivatorService(props, model)
  const { classListPosition } = usePositionService(props)

  const getContentLocation = () => {
    const element = activatorService.contentElement.value
    const activatorLocation = activatorService.getActivatorLocation()
    const viewportLocation = getViewportLocation()

    if (!element || !activatorLocation || !viewportLocation) {
      return null
    }

    const width = options?.noContentMinWidth
      ? element.offsetWidth
      : Math.max(element.offsetWidth, activatorLocation.width)

    const height = element.offsetHeight
    const shouldAlignMiddle = !isLeft.value && !isRight.value && options?.alignMiddle
    const transformX = shouldAlignMiddle ? (activatorLocation.width - width) / 2 - offset : 0

    const left =
      offset +
      (props.offsetX ?? 0) +
      (props.position === 'fixed' ? 0 : viewportLocation.left) +
      activatorLocation.left +
      (isRight.value ? activatorLocation.width : 0) +
      (isLeft.value ? -width : 0) +
      transformX

    const top =
      offset +
      (props.offsetY ?? 0) +
      (props.position === 'fixed' ? 0 : viewportLocation.top) +
      activatorLocation.top +
      (isBottom.value ? activatorLocation.height : 0) +
      (isTop.value ? -height : 0)

    return {
      left,
      top,
      width,
      height,
      bottom: top + height,
      right: left + width,
    }
  }

  const updateLocation = (viewportLocation = getViewportLocation()) => {
    const activator = activatorService.getActivatorLocation()
    const contentLocation = getContentLocation()

    if (!activator || !viewportLocation || !contentLocation) {
      return
    }

    const { width: activatorWidth } = activator

    const overflowRight = Math.max(contentLocation.right - viewportLocation.right, 0)
    const isOverflowBottom = contentLocation.top + contentLocation.height >= (getDocument()?.body.offsetHeight ?? 0)
    const overflowBottom =  isOverflowBottom ? Math.max(contentLocation.bottom - viewportLocation.bottom, 0) : 0

    top.value = Math.min(contentLocation.top, contentLocation.top - overflowBottom)
    left.value = Math.max(viewportLocation.left, contentLocation.left - overflowRight)
    minWidth.value = options?.noContentMinWidth ? null : activatorWidth

    if (props.screenPadding) {
      // Adding margin so menu will have some space between border of the window screen
      const contentPadding = 16 * 2

      if (left.value + activatorWidth + contentPadding + props.screenPadding > (getWindow()?.screen.width ?? 0)) {
        left.value -= props.screenPadding
      }
    }
  }

  const contentClasses = computed<Record<string, boolean>>(() => {
    return getCleanSetObject({
      ...content.classes.value,
      ...classListPosition.value,
    })
  })

  const contentStyles = computed<MenuContentStyle>(() => {
    const minWidthToSet = options?.noContentMinWidth ? undefined : getNumericCssAttribute(minWidth.value)

    const styles: MenuContentStyle = {
      top: getNumericCssAttribute(top.value),
      left: getNumericCssAttribute(left.value),
      ...content.styles.value,
    }

    if (minWidthToSet) {
      styles.minWidth = minWidthToSet
    }

    return styles
  })

  return {
    ...activatorService,
    contentClasses,
    contentStyles,
    updateLocation,
  }
}

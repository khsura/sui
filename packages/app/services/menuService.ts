import { type PropsMenu } from '@sui/app/definitions'
import { getNumericCssAttribute } from '@sui/app/lib'
import { getViewportLocation } from '@sui/app/lib/browser'
import { type MenuContentStyle } from '@sui/app/types'
import { computed, ref, type ModelRef } from 'vue'
import { useActivatorService, useContentService, useLocationService } from './core'

export const useMenuService = (
  props: PropsMenu,
  model: ModelRef<boolean | null | undefined>,
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
      viewportLocation.left +
      activatorLocation.left +
      (isRight.value ? activatorLocation.width : 0) +
      (isLeft.value ? -width : 0) +
      transformX

    const top =
      offset +
      (props.offsetY ?? 0) +
      viewportLocation.top +
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

  const updateLocation = () => {
    const { width } = activatorService.getActivatorLocation() ?? {}
    const viewportLocation = getViewportLocation()
    const contentLocation = getContentLocation()

    if (!width || !viewportLocation || !contentLocation) {
      return
    }

    const overflowBottom = Math.max(contentLocation.bottom - viewportLocation.bottom, 0)
    const overflowRight = Math.max(contentLocation.right - viewportLocation.right, 0)

    top.value = Math.max(viewportLocation.top, contentLocation.top - overflowBottom)
    left.value = Math.max(viewportLocation.left, contentLocation.left - overflowRight)
    minWidth.value = options?.noContentMinWidth ? null : width
  }

  return {
    updateLocation,
    ...activatorService,
    contentClasses: content.classes,
    contentStyles,
  }
}

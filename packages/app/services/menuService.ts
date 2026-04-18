import { computed, ref, type ComponentPublicInstance, type Ref, type ShallowRef } from 'vue'
import { usePositionService } from './positionService'
import { useActivatorService, useContentService, useLocationService } from './core'
import { type PropsMenu } from '@/app/definitions'
import { getCleanSetObject, getDocument, getNumericCssAttribute, getViewportLocation, getWindow } from '@/app/lib'
import { type MenuContentStyle } from '@/app/types'

export const useMenuService = (
  props: PropsMenu,
  model: Ref<boolean | undefined, string>,
  templateRefs: {
    activatorElement: Readonly<ShallowRef<HTMLElement | null>>
    contentElement: Readonly<ShallowRef<HTMLElement | ComponentPublicInstance | null>>
  },
  options?: {
    noContentMinWidth?: boolean
    offset?: number
    alignMiddle?: boolean
    preventOverlap?: boolean
    autoFlip?: boolean
    onChange?: (v: boolean | undefined | null) => void
  },
) => {
  const { isRight, isLeft, isBottom, isTop } = useLocationService(props)
  const offset = options?.offset ?? 0
  const content = useContentService(props)
  const top = ref(0)
  const left = ref(0)
  const minWidth = ref<number | null>(null)
  const maxHeight = ref<number | null>(null)
  const activatorService = useActivatorService(props, model, templateRefs.activatorElement)
  const { classListPosition } = usePositionService(props)

  const getContentHTMLElement = (element: HTMLElement | ComponentPublicInstance | null) => {
    if (!element) {
      return null
    }

    if (element instanceof HTMLElement) {
      return element
    }

    return element.$el
  }

  const getContentLocation = () => {
    const element = getContentHTMLElement(templateRefs.contentElement.value)
    const activatorLocation = activatorService.getActivatorLocation()
    const viewportLocation = getViewportLocation()

    if (!element || !activatorLocation || !viewportLocation) {
      return null
    }

    const elementOffsetWidth = element.offsetWidth ?? 0

    const width = options?.noContentMinWidth
      ? elementOffsetWidth
      : Math.max(elementOffsetWidth, activatorLocation.width)

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

    // autoFlip: pick whichever side (above/below activator) has more room,
    // and clamp the menu's height so it never overlaps the activator.
    let placementIsTop = isTop.value
    let resolvedMaxHeight: number | null = null

    if (options?.autoFlip) {
      const padding = 8
      const spaceAbove = activatorLocation.top - offset - padding
      const spaceBelow = viewportLocation.height - (activatorLocation.top + activatorLocation.height) - offset - padding
      const preferredIsTop = isTop.value
      const preferredSpace = preferredIsTop ? spaceAbove : spaceBelow
      const oppositeSpace = preferredIsTop ? spaceBelow : spaceAbove

      if (preferredSpace < height && oppositeSpace > preferredSpace) {
        placementIsTop = !preferredIsTop
      } else {
        placementIsTop = preferredIsTop
      }

      const chosenSpace = placementIsTop ? spaceAbove : spaceBelow

      resolvedMaxHeight = Math.max(120, chosenSpace)
    }

    const effectiveHeight = resolvedMaxHeight !== null ? Math.min(height, resolvedMaxHeight) : height
    let top: number

    if (options?.autoFlip) {
      top =
        offset +
        (props.offsetY ?? 0) +
        (props.position === 'fixed' ? 0 : viewportLocation.top) +
        activatorLocation.top +
        (placementIsTop ? -effectiveHeight : activatorLocation.height)
    } else if (options?.preventOverlap) {
      top =
        offset +
        (props.offsetY ?? 0) +
        (props.position === 'fixed' ? 0 : viewportLocation.top) +
        activatorLocation.top +
        activatorLocation.height
    } else {
      top =
        offset +
        (props.offsetY ?? 0) +
        (props.position === 'fixed' ? 0 : viewportLocation.top) +
        activatorLocation.top +
        (isBottom.value ? activatorLocation.height : 0) +
        (isTop.value ? -height : 0)
    }

    const isBottomOverflow =
      !options?.autoFlip && viewportLocation.isWithinOverlay ? top + height >= viewportLocation.bottom : false

    const adjustedTop = isBottomOverflow ? viewportLocation.bottom - height : top

    return {
      left,
      top: adjustedTop,
      width,
      height: effectiveHeight,
      bottom: adjustedTop + effectiveHeight,
      right: left + width,
      maxHeight: resolvedMaxHeight,
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
    const overflowBottom = isOverflowBottom ? Math.max(contentLocation.bottom - viewportLocation.bottom, 0) : 0

    top.value = Math.min(contentLocation.top, contentLocation.top - overflowBottom)
    left.value = Math.max(viewportLocation.left, contentLocation.left - overflowRight)
    minWidth.value = options?.noContentMinWidth ? null : activatorWidth
    maxHeight.value = contentLocation.maxHeight

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

    const styles: MenuContentStyle = getCleanSetObject({
      top: getNumericCssAttribute(top.value),
      left: getNumericCssAttribute(left.value),
      ...content.styles.value,
    })

    if (minWidthToSet) {
      styles.minWidth = minWidthToSet
    }

    if (maxHeight.value !== null) {
      styles.maxHeight = getNumericCssAttribute(maxHeight.value)
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

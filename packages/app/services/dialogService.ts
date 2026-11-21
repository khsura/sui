import { type ModelRef, type ShallowRef, computed } from 'vue'
import { STransition, cssVariables } from '@/app/constants'
import { getCleanSetObject } from '@/app/lib/getCleanSetObject'
import { type PropsDialog } from '@/app/definitions'
import { useActivatorService, useLocationService } from '@/app/services/core'
import { useElevationService } from '@/app/services/elevationService'
import { useMeasurableStylesService } from '@/app/services/measurableStylesService'

export const useDialogService = (
  props: PropsDialog,
  isDialogOpen: ModelRef<boolean | null | undefined>,
  activatorElement: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const { isBottom } = useLocationService(props)
  const { activatorAttrs, activatorOn } = useActivatorService(props, isDialogOpen, activatorElement)
  const { measurableStyles } = useMeasurableStylesService(props)
  const { classListElevation } = useElevationService(props)

  const contentClasses = computed(() => ({
    s_dialog__content: true,
    's_dialog__content--active': isDialogOpen.value,
    's_dialog__content--persistent': props.persistent,
    's_dialog__content--scrollable': props.scrollable,
    's_dialog__content--fullscreen': props.fullscreen,
    's_dialog__content--bottom': isBottom.value,
    's_dialog__content--borderless': props.borderless,
    ...classListElevation.value,
  }))

  // Width and height go through CSS variables, so the stylesheet can cap them at the viewport minus a gutter:
  // an inline `max-width: 420px` would otherwise beat the stylesheet and touch the edges of a phone screen.
  const contentStyles = computed(() => {
    const { width, maxWidth, height, maxHeight, ...otherStyles } = measurableStyles.value

    return getCleanSetObject({
      ...otherStyles,
      [cssVariables.dialogWidth]: width,
      [cssVariables.dialogMaxWidth]: maxWidth,
      [cssVariables.dialogHeight]: height,
      [cssVariables.dialogMaxHeight]: maxHeight,
    })
  })

  const onClickOutside = () => {
    if (!props.persistent && isDialogOpen.value === true) {
      isDialogOpen.value = false
    }
  }

  const transitionName = computed(() => {
    return isBottom.value ? 's_transition__dialog--bottom' : STransition.appear
  })

  return {
    activatorElement,
    activatorOn,
    activatorAttrs,
    contentClasses,
    contentStyles,
    transitionName,
    onClickOutside,
  }
}

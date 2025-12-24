import { type ModelRef, type ShallowRef, computed } from 'vue'
import { STransition } from '@khsura/sui/constants'
import { type PropsDialog } from '@khsura/sui/definitions'
import { useActivatorService, useLocationService } from '@khsura/sui/services/core'
import { useElevationService } from '@khsura/sui/services/elevationService'
import { useMeasurableStylesService } from '@khsura/sui/services/measurableStylesService'

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

  const contentStyles = computed(() => {
    return {
      ...measurableStyles.value,
    }
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

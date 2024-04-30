import { type PropsDialog } from '@sui/app/definitions'
import { useActivatorService } from '@sui/app/services/core/activatorService'
import { useElevationService } from '@sui/app/services'
import { type ModelRef, computed } from 'vue'
import { STransition } from '../constants'
import { useMeasurableStylesService } from './measurableStylesService'
import { useLocationService } from './core/locationService'

export const useDialogService = (props: PropsDialog, isDialogOpen: ModelRef<boolean | null | undefined>) => {
  const { isBottom } = useLocationService(props)
  const { activatorAttrs, activatorElement, activatorOn } = useActivatorService(props, isDialogOpen)
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

  const enableBackgroundScroll = () => {
    const activeCount = document.querySelectorAll('.s_dialog__content--active').length

    if (activeCount === 1) {
      document?.querySelector('html')?.classList.remove('s_overflowY--hidden')
    }
  }

  const disableBackgroundScroll = () => {
    document?.querySelector('html')?.classList.add('s_overflowY--hidden')
  }

  return {
    activatorElement,
    activatorOn,
    activatorAttrs,
    contentClasses,
    contentStyles,
    transitionName,
    onClickOutside,
    enableBackgroundScroll,
    disableBackgroundScroll,
  }
}

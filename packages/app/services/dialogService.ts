import { STransition } from '@sui/app/constants'
import { type PropsDialog } from '@sui/app/definitions'
import { type EmitDialog } from '@sui/app/types'
import { computed } from 'vue'
import { useActivatorService, useLocationService } from './core'
import { useMeasurableStylesService } from './measurableStylesService'

export const useDialogService = (props: PropsDialog, emit: EmitDialog) => {
  const { isBottom } = useLocationService(props)

  const { contentElement, activatorAttrs, activatorElement, activatorOn, onClickOutside, model } = useActivatorService(
    props,
    emit,
    'modelValue',
  )

  const { measurableStyles } = useMeasurableStylesService(props)

  const contentClasses = computed(() => ({
    s_dialog__content: true,
    's_dialog__content--active': props.modelValue,
    's_dialog__content--persistent': props.persistent,
    's_dialog__content--scrollable': props.scrollable,
    's_dialog__content--fullscreen': props.fullscreen,
    's_dialog__content--bottom': isBottom.value,
  }))

  const contentStyles = computed(() => {
    return {
      ...measurableStyles.value,
    }
  })

  onClickOutside(() => {
    model.value = !!(props.persistent && model.value === true)
  })

  const transitionName = computed(() => {
    return isBottom.value ? 's_transition__dialog--bottom' : STransition.appear
  })

  return {
    activatorElement,
    contentElement,
    model,
    activatorOn,
    activatorAttrs,
    contentClasses,
    contentStyles,
    transitionName,
  }
}

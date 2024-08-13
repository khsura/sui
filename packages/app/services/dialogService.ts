import { STransition } from '@khsura/sui/constants'
import { type PropsDialog } from '@khsura/sui/definitions'
import { useActivatorService, useLocationService } from '@khsura/sui/services/core'
import { useElevationService } from '@khsura/sui/services/elevationService'
import { useMeasurableStylesService } from '@khsura/sui/services/measurableStylesService'
import { type ModelRef, computed, nextTick } from 'vue'
import { z } from 'zod'

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

  const enableBackgroundScroll = async () => {
    const activeCount = document.querySelectorAll('.s_dialog__content--active').length
    const html = document.querySelector<HTMLElement>('html')

    if (activeCount === 1 && html) {
      const x = z.coerce.number().parse(html.style.getPropertyValue('--s-body-scroll-x').replace('px', ''))
      const y = z.coerce.number().parse(html.style.getPropertyValue('--s-body-scroll-y').replace('px', ''))

      html.style.setProperty('--s-body-scroll-x', null)
      html.style.setProperty('--s-body-scroll-y', null)
      html.classList.remove('s_overlay__scrollBlocked')

      await nextTick()

      window.scrollTo({ left: -1 * x, top: -1 * y, behavior: 'instant' })
    }
  }

  const disableBackgroundScroll = () => {
    const html = document.querySelector<HTMLElement>('html')

    if (html) {
      html.style.setProperty('--s-body-scroll-x', `-${window.scrollX}px`)
      html.style.setProperty('--s-body-scroll-y', `-${window.scrollY}px`)
      html.classList.add('s_overlay__scrollBlocked')
    }
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

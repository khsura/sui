import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { type PropsActivator } from '@khsura/sui/definitions'
import { getDocument } from '@khsura/sui/lib/browser'
import { getCleanSetObject } from '@khsura/sui/lib/getCleanSetObject'

export const useActivatorElementService = (props: Pick<PropsActivator, 'activator'>) => {
  const activatorElement: Ref<HTMLElement | null> = ref(null)

  const computedActivatorElement: ComputedRef<HTMLElement | null> = computed(() => {
    if (!props.activator || activatorElement.value !== null) {
      return (activatorElement.value?.firstElementChild ?? null) as HTMLElement | null
    }

    if (typeof props.activator === 'string') {
      return getDocument()?.querySelector<HTMLElement>(props.activator) ?? null
    }

    if (props.activator instanceof HTMLElement) {
      return props.activator
    }

    return props.activator.$el as HTMLElement
  })

  return {
    activatorElement,
    computedActivatorElement,
  }
}

export const useActivatorService = (props: PropsActivator, model?: Ref<boolean | null | undefined>) => {
  const contentElement: Ref<HTMLElement | null> = ref(null)
  const { activatorElement, computedActivatorElement } = useActivatorElementService(props)

  const activatorOn = {
    click: () => {
      if (model === undefined) {
        return
      }

      model.value = !(props.closeOnClick && model.value)
    },
  }

  const activatorAttrs = computed(() => {
    return getCleanSetObject({
      disabled: props.disabled,
      readonly: props.readonly,
    })
  })

  const getActivatorLocation = () => {
    const element = computedActivatorElement.value

    if (!element) {
      return null
    }

    return element.getBoundingClientRect()
  }

  return {
    activatorElement,
    computedActivatorElement,
    contentElement,
    activatorOn,
    activatorAttrs,
    getActivatorLocation,
  }
}

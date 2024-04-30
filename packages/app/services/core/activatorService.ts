import { type PropsActivator } from '@sui/app/definitions'
import { getDocument } from '@sui/app/lib/browser'
import { getCleanSetObject } from '@sui/app/lib/getCleanSetObject'
import { ref, computed, type Ref, type ComputedRef } from 'vue'

export const useActivatorService = (props: PropsActivator, model: Ref<boolean | null | undefined>) => {
  const contentElement: Ref<HTMLElement | null> = ref(null)
  const activatorElement: Ref<HTMLElement | null> = ref(null)

  const activatorOn = {
    click: () => {
      model.value = !(props.closeOnClick && model.value)
    },
  }

  const activatorAttrs = computed(() => {
    return getCleanSetObject({
      disabled: props.disabled,
      readonly: props.readonly,
    })
  })

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

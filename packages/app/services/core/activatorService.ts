import { computed, type Ref, type ComputedRef, type ShallowRef } from 'vue'
import { type PropsActivator } from '@/app/definitions'
import { getDocument } from '@/app/lib/browser'
import { getCleanSetObject } from '@/app/lib/getCleanSetObject'

export const useActivatorElementService = (
  props: Pick<PropsActivator, 'activator'>,
  activatorElementRef?: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const computedActivatorElement: ComputedRef<HTMLElement | null> = computed(() => {
    const activatorElementRefValue = activatorElementRef?.value ?? null

    if (!props.activator || activatorElementRefValue !== null) {
      return (activatorElementRefValue?.firstElementChild ?? null) as HTMLElement | null
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
    computedActivatorElement,
  }
}

export const useActivatorService = (
  props: PropsActivator,
  model?: Ref<boolean | null | undefined>,
  activatorElement?: Readonly<ShallowRef<HTMLElement | null>>,
) => {
  const { computedActivatorElement } = useActivatorElementService(props, activatorElement)

  const activatorOn = {
    click: () => {
      if (model === undefined) {
        return
      }

      if (props.preventCloseOnClick && model.value === true) {
        return
      }

      model.value = !model.value
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
    computedActivatorElement,
    activatorOn,
    activatorAttrs,
    getActivatorLocation,
  }
}

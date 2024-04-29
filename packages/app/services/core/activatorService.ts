import { type PropsActivator, type PropsSelectMenuActivator } from '@sui/app/definitions'
import { getDocument, getWindow } from '@sui/app/lib/browser'
import { getCleanSetObject } from '@sui/app/lib/getCleanSetObject'
import { type EmitActivator } from '@sui/app/types'
import { ref, computed } from 'vue'
import { type Ref, type ComputedRef, type WritableComputedRef } from 'vue'
import { useClickOutsideService } from './clickOutsideService'
import { useModelService } from './modelService'

export const useActivatorService = <T extends 'modelValue' | 'menu'>(
  props: T extends 'menu' ? PropsSelectMenuActivator : PropsActivator,
  emit: EmitActivator<T>,
  name: T,
  onModelChange?: (v: boolean | undefined | null) => void,
) => {
  const contentElement: Ref<HTMLElement | null> = ref(null)
  const activatorElement: Ref<HTMLElement | null> = ref(null)
  const { onClick } = useClickOutsideService()
  const listeners: Array<{ register: () => void; unregister: () => void }> = []

  const model: WritableComputedRef<boolean | null | undefined> = useModelService<boolean | null | undefined, T>(
    props,
    emit,
    name,
    {
      onChange: (newValue) => {
        const value = newValue

        onModelChange?.(value)

        getWindow()?.setTimeout(() => {
          if (value) {
            listeners.forEach((listener) => {
              listener.register()
            })
          } else {
            listeners.forEach((listener) => {
              listener.unregister()
            })
          }
        })
      },
    },
  )

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

  const onClickOutside = (eventListener: (event: Event) => void) => {
    listeners.push(
      onClick([contentElement, computedActivatorElement], ({ isOutside }, event) => {
        if (isOutside) {
          eventListener(event)
        }
      }),
    )
  }

  const onClickContent = (eventListener: (event: Event) => void) => {
    listeners.push(
      onClick([contentElement, computedActivatorElement], ({ isOutside }, event) => {
        if (!isOutside && contentElement.value?.contains(event.target as HTMLElement)) {
          eventListener(event)
        }
      }),
    )
  }

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
    getActivatorLocation,
    contentElement,
    model,
    activatorOn,
    activatorAttrs,
    onClickOutside,
    onClickContent,
  }
}

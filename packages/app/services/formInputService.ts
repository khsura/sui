import { ref, computed, nextTick, onUnmounted, watch, onMounted, type EmitFn, useId, type Ref } from 'vue'
import { useProviderService } from './core/providerService'
import { ProviderName } from '@/app/constants/provider'
import { type PropsFormInput } from '@/app/definitions'
import { type EmitFormInput, type FormInputModelValue } from '@/app/types'

export const useFormInputService = <T extends FormInputModelValue = FormInputModelValue>(
  props: PropsFormInput,
  emit: EmitFn<EmitFormInput<T>>,
  model: Ref<T | undefined>,
) => {
  const { inject } = useProviderService()
  const rawErrors = ref<string[]>([])
  const dirty = ref(false)
  const uniqueId = useId()
  const inputId = computed(() => props.id ?? uniqueId)

  const form = inject(ProviderName.form, {
    registerItem: () => undefined,
    unregisterItem: () => undefined,
    updateItem: () => undefined,
  })

  const hasError = computed(() => {
    return props.disabled ? false : rawErrors.value.length > 0
  })

  const errors = computed(() => {
    return props.disabled ? [] : rawErrors.value
  })

  const emitEvents = () => {
    emit('update:error', hasError.value)
    emit('update:errors', errors.value)
    emit('update:dirty', dirty.value)
  }

  const validate = (value?: T) => {
    dirty.value = true
    rawErrors.value = (props.rules ?? [])
      .map((rule) => {
        return rule(value ?? model.value)
      })
      .filter((error) => error && typeof error === 'string') as string[]
    emitEvents()
  }

  const reset = () => {
    rawErrors.value = []
    dirty.value = false
    emitEvents()
  }

  onMounted(() => {
    form.registerItem?.(inputId.value, {
      validate,
      reset,
      errors,
      hasError,
    })
  })

  watch(
    () => props.dirty,
    (value) => {
      if (value !== dirty.value) {
        dirty.value = !!value
      }
    },
    {
      immediate: true,
    },
  )

  watch([() => props.disabled], () => {
    validate()
  })

  onUnmounted(() => {
    form.unregisterItem?.(inputId.value)
  })

  const updateFormInput = async (value?: T) => {
    if (value !== undefined) {
      emit('change', value)
    }

    await nextTick()
    if (form.updateItem) {
      /**
       * @see {@link ./src/components/form/form.vue}
       * if parent form exists, validate function will be called from form.vue
       */
      form.updateItem(inputId.value)
    } else {
      validate(value)
    }

    return hasError.value
  }

  return {
    updateFormInput,
    errors,
  }
}

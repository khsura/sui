import { ProviderName } from '@khsura/sui/constants/provider'
import { type PropsFormInput } from '@khsura/sui/definitions'
import { type EmitFormInput, type FormInputModelValue } from '@khsura/sui/types'
import { ref, computed, nextTick, onUnmounted, watch, onMounted, type EmitFn } from 'vue'
import { useProviderService } from './core/providerService'

export const useFormInputService = <T extends FormInputModelValue = FormInputModelValue>(
  props: PropsFormInput<T>,
  emit: EmitFn<EmitFormInput<T>>,
) => {
  const { inject } = useProviderService()
  const rawErrors = ref<string[]>([])
  const dirty = ref(false)

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
    rawErrors.value = props.rules
      .map((rule) => {
        return rule(value ?? props.modelValue)
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
    form.registerItem?.(props.id, {
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
    form.unregisterItem?.(props.id)
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
      form.updateItem(props.id)
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

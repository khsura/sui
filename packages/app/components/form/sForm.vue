<template>
  <form class="s_form">
    <slot></slot>
  </form>
</template>
<script setup lang="ts">
import { ProviderName } from '@sui/app/constants'
import { propsForm } from '@sui/app/props'
import { useModelService, useProviderService } from '@sui/app/services'
import { type FormProviderRegisterInputAttribute } from '@sui/app/types'
import { computed } from 'vue'

const props = defineProps({
  ...propsForm(),
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
  (event: 'update:error', value: boolean): void
  (event: 'update:dirty', value: boolean): void
  (event: 'update:errors', value: string[]): void
  // TODO (Sura) improve type. for now if we add this, it causes error
  // (event: 'submit', value: Event): void
}>()

const model = useModelService(props, emit)
const errors = useModelService(props, emit, 'errors')
const error = useModelService(props, emit, 'error')
const { provide } = useProviderService()

const formInputs: Record<string, FormProviderRegisterInputAttribute> = {}

const updateProps = () => {
  errors.value = ([] as string[]).concat(...Object.values(formInputs).map(({ errors }) => errors.value))
  error.value = errors.value.length > 0
  model.value = !error.value
}

const validate = () => {
  Object.entries(formInputs).forEach(([id, { validate }]) => {
    if (validate) {
      validate()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete formInputs[id]
    }
  })
  updateProps()

  return errors.value.length > 0
}

const resetValidation = () => {
  Object.keys(formInputs).forEach((id) => {
    formInputs[id].reset?.()
  })
  updateProps()
}

provide(ProviderName.form, {
  registerItem: (formInputId, listener) => {
    formInputs[formInputId] = {
      validate: listener.validate,
      reset: listener.reset,
      errors: computed(() => listener.errors.value),
      hasError: computed(() => listener.hasError.value),
    }
  },
  unregisterItem: (formInputId) => {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete formInputs[formInputId]
  },
  updateItem: (formInputId) => {
    const validateInput = formInputs[formInputId]?.validate

    if (validateInput) {
      validateInput()
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete formInputs[formInputId]
    }

    updateProps()
  },
})

defineExpose({
  validate,
  resetValidation,
})
</script>

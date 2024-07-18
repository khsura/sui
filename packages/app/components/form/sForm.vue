<template>
  <form class="s_form">
    <slot></slot>
  </form>
</template>
<script setup lang="ts">
import { ProviderName } from '@khsura/sui/constants'
import { propsForm } from '@khsura/sui/props'
import { useProviderService } from '@khsura/sui/services'
import { type FormProviderRegisterInputAttribute } from '@khsura/sui/types'
import { computed } from 'vue'

defineProps(propsForm())
defineEmits(['submit'])
const model = defineModel<boolean>()
const errors = defineModel<string[]>('errors', { default: [] })
const error = defineModel<boolean>('error')
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

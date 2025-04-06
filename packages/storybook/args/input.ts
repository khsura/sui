import type SInput from '@khsura/sui/components/form/sInput.vue'
import type { ComponentPropsAndSlots } from '@storybook/vue3'

export const argsInput: Partial<ComponentPropsAndSlots<typeof SInput>> = {
  dirty: false,
  error: false,
  rules: [],
  hideDetails: false,
  readonly: false,
  modelValue: '',
  placeholder: 'Text',
  type: 'text',
  autocomplete: 'off',
  label: 'Text',
  placeholderBackground: null,
}

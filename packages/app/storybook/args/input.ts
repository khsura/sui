import { type ComponentProps } from 'vue-component-type-helpers'
import { type SInput } from '~/index'

export const argsInput: Partial<ComponentProps<typeof SInput>> = {
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

import { type PropType } from 'vue'

export const propsForm = () => {
  return {
    modelValue: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    error: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    errors: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  }
}

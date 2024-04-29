import { type PropType } from 'vue'

export const propsStepper = () => {
  return {
    shrink: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Number,
      required: true,
    },
    items: {
      type: Array as PropType<Array<{ editable?: boolean; step: number; text?: string }>>,
      default: () => [],
    },
  }
}

import { type PropType } from 'vue'
import { type GroupItemValue } from '@khsura/sui/types'

export const propsSingleGroup = () => {
  return {
    mandatory: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: [Number, Boolean, Symbol, String] as PropType<GroupItemValue | undefined>,
      default: undefined,
    },
    continuous: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  }
}

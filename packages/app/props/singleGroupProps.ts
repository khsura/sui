import { type GroupItemValue } from '@sui/app/types'

import { type PropType } from 'vue'

export const propsSingleGroup = () => {
  return {
    mandatory: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: [Number, Boolean, Symbol, String] as PropType<GroupItemValue | null>,
      default: null,
    },
    continuous: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  }
}

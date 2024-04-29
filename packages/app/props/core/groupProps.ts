import { type GroupItemValue } from '@sui/app/types'

import { type PropType } from 'vue'

export const propsGroup = <T extends GroupItemValue = any>() => {
  return {
    multiple: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    mandatory: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: Array as PropType<T[] | null>,
      default: null,
    },
  }
}

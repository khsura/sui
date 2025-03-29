import { type PropType } from 'vue'
import { type GroupItemValue } from '~/types'

export const propsGroup = <T extends GroupItemValue = GroupItemValue>() => {
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

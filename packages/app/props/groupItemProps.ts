import { type PropType } from 'vue'
import { type GroupItemValue } from '~/types'

export const propsGroupItem = <T extends GroupItemValue = GroupItemValue>() => {
  return {
    index: {
      type: [String, Number, Boolean, Symbol] as PropType<T | null>,
      default: null,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    activeClass: {
      type: String as PropType<string | null>,
      default: null,
    },
  }
}

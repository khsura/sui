import { type PropType } from 'vue'
import { type GroupItemValue } from '@khsura/sui/types'
import { propsDisabled } from './core/disabledProps'

export const propsSingleGroupItem = () => {
  return {
    value: {
      type: [String, Number, Boolean, Symbol] as PropType<GroupItemValue | null>,
      default: null,
    },
    activeClass: {
      type: String as PropType<string | null>,
      default: null,
    },
    ...propsDisabled(),
  }
}

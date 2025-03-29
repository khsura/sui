import { type PropType } from 'vue'
import { type GroupItemValue } from '~/types'
import { propsBorder } from './core/borderProps'
import { propsFormInput } from './formInputProps'
import { propsSingleGroup } from './singleGroupProps'

export const propsRadioGroup = () => {
  return {
    name: {
      type: String as PropType<string | undefined | null>,
      required: true,
    },
    grow: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: false,
    },
    color: {
      type: String as PropType<string | undefined | null>,
      default: null,
    },
    column: {
      type: Boolean as PropType<boolean | undefined | null>,
      default: false,
    },
    ...propsBorder(),
    ...propsFormInput<GroupItemValue>(),
    ...propsSingleGroup(),
  }
}

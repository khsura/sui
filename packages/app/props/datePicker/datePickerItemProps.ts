import { type PropType } from 'vue'
import { type DatePickerTypeType, type DatePickerSelectTypeType } from '~/types'
import { propsDatePickerRange } from './core/datePickerRangeProps'

export const propsDatePickerItem = () => {
  return {
    date: {
      type: String as PropType<string>,
      required: true,
    },
    selected: {
      type: String,
      default: null,
    },
    today: {
      type: String,
      required: true,
    },
    type: {
      type: String as PropType<DatePickerTypeType>,
      required: true,
    },
    height: {
      type: Number as PropType<number | null | undefined>,
      default: undefined,
    },
    dense: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    selectedType: {
      type: String as PropType<DatePickerSelectTypeType>,
      required: true,
    },
    ...propsDatePickerRange,
  } as const
}

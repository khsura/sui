import { type PropType } from 'vue'
import { type MaterialDesignIcon } from '~/types'
import { propsDatePickerFormat } from './core/datePickerFormatProps'
import { propsDatePickerItem } from './datePickerItemProps'

export const propsDatePickerItemSwitch = () => {
  return {
    ...propsDatePickerItem(),
    ...propsDatePickerFormat,
    nextAriaLabel: {
      type: String,
      default: null,
    },
    prevAriaLabel: {
      type: String,
      default: null,
    },
    nextIcon: {
      type: String as PropType<MaterialDesignIcon>,
      default: 'mdi-chevron-right',
    },
    prevIcon: {
      type: String as PropType<MaterialDesignIcon>,
      default: 'mdi-chevron-left',
    },
  }
}

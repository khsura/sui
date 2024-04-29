import { type MaterialDesignIcon } from '@sui/app/types'
import { type PropType } from 'vue'
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

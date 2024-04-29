import { propsDatePickerFormat } from './core/datePickerFormatProps'
import { propsDatePickerItem } from './datePickerItemProps'

export const propsDatePickerItemTitle = () => {
  return {
    ...propsDatePickerItem(),
    ...propsDatePickerFormat,
  }
}

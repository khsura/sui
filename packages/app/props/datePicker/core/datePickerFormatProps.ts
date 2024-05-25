import { datePickerDisplayFormat } from '@khsura/sui/configs/datePicker'

import { type PropType } from 'vue'

export const propsDatePickerFormat = {
  yearFormat: {
    type: String as PropType<string>,
    default: datePickerDisplayFormat.year,
  },
  monthFormat: {
    type: String as PropType<string>,
    default: datePickerDisplayFormat.month,
  },
  dateFormat: {
    type: String as PropType<string>,
    default: datePickerDisplayFormat.date,
  },
}

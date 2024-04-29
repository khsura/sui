import { datePickerModelFormats } from '@sui/app/configs/datePicker'
import { datePickerDefaultYearLimit } from '@sui/app/constants/datePicker'
import dayjs from '@sui/app/vendors/dayjs'

import { type PropType } from 'vue'

export const propsDatePickerRange = {
  max: {
    type: String as PropType<string | undefined>,
    default: dayjs().endOf('year').format(datePickerModelFormats.date),
  },
  min: {
    type: String as PropType<string | undefined>,
    default: dayjs().subtract(datePickerDefaultYearLimit, 'year').startOf('year').format(datePickerModelFormats.date),
  },
}

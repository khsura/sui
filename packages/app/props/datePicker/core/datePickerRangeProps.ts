import { type PropType } from 'vue'
import { datePickerModelFormats } from '@khsura/sui/configs/datePicker'
import { datePickerDefaultYearLimit } from '@khsura/sui/constants/datePicker'
import dayjs from '@khsura/sui/vendors/dayjs'

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

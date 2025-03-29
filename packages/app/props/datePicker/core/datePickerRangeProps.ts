import { type PropType } from 'vue'
import { datePickerModelFormats } from '~/configs/datePicker'
import { datePickerDefaultYearLimit } from '~/constants/datePicker'
import dayjs from '~/vendors/dayjs'

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

import { datePickerModelFormats } from '@sui/app/configs/datePicker'
import { DatePickerType, datePickerWidth } from '@sui/app/constants/datePicker'
import { propsColor } from '@sui/app/props/core/colorProps'
import { propsMeasurableStyles } from '@sui/app/props/core/measurableStyles'
import { type PresetColorType, type DatePickerTypeType } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'

import { type PropType } from 'vue'
import { propsDisabled } from '../core/disabledProps'
import { propsDatePickerFormat } from './core/datePickerFormatProps'
import { propsDatePickerRange } from './core/datePickerRangeProps'

export const propsDatePicker = () => {
  const { width } = propsMeasurableStyles({ width: datePickerWidth })

  return {
    modelValue: {
      type: String as PropType<string>,
      default: () => dayjs().format(datePickerModelFormats.date),
    },
    type: {
      type: String as PropType<DatePickerTypeType>,
      default: DatePickerType.date,
    },
    today: {
      type: String,
      default: () => dayjs().format(datePickerModelFormats.date),
    },
    dense: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    hideTitle: {
      type: Boolean as PropType<boolean | null | undefined>,
      default: false,
    },
    width,
    ...propsColor<PresetColorType>({ color: 'info' }),
    ...propsDisabled(),
    ...propsDatePickerFormat,
    ...propsDatePickerRange,
  }
}

import { type PropType } from 'vue'
import { datePickerModelFormats } from '~/configs/datePicker'
import { DatePickerType, datePickerWidth } from '~/constants/datePicker'
import { propsColor } from '~/props/core/colorProps'
import { propsMeasurableStyles } from '~/props/core/measurableStyles'
import { type PresetColorType, type DatePickerTypeType } from '~/types'
import dayjs from '~/vendors/dayjs'

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

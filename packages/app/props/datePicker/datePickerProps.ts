import { type PropType } from 'vue'
import { datePickerModelFormats } from '@khsura/sui/configs/datePicker'
import { DatePickerType, datePickerWidth } from '@khsura/sui/constants/datePicker'
import { propsColor } from '@khsura/sui/props/core/colorProps'
import { propsMeasurableStyles } from '@khsura/sui/props/core/measurableStyles'
import { type PresetColorType, type DatePickerTypeType } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'
import { propsDisabled } from '../core/disabledProps'
import { propsDatePickerRange } from './core/datePickerRangeProps'
import { propsDatePickerFormat } from './core/datePickerFormatProps'

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

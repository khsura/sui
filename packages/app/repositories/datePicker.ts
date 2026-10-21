import { datePickerModelFormats, datePickerStepUnits } from '@/app/configs/datePicker'
import { DatePickerSelectType } from '@/app/constants/datePicker'
import {
  type DatePickerCompareUnit,
  type DatePickerSelectTypeType,
  type DatePickerStepUnit,
  type DatePickerSwitchType,
  type DatePickerTypeType,
} from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const getDatePickerFormat = (type: DatePickerTypeType) => {
  return datePickerModelFormats[type]
}

export const getDatePickerSwitchType = (type: DatePickerSelectTypeType): DatePickerSwitchType | undefined => {
  if (type === DatePickerSelectType.date) {
    return DatePickerSelectType.month
  }

  if (type === DatePickerSelectType.month) {
    return DatePickerSelectType.year
  }

  return undefined
}

/** Granularity of a single carousel step for the given picker type. */
export const getDatePickerStepUnit = (type: DatePickerTypeType): DatePickerStepUnit => {
  return datePickerStepUnits[type].step
}

/** Granularity used to compare a value against the `min`/`max` bounds for the given picker type. */
export const getDatePickerCompareUnit = (type: DatePickerTypeType): DatePickerCompareUnit => {
  return datePickerStepUnits[type].compare
}

/**
 * Parses a value of the given picker type into a dayjs instance.
 * `month` and `year` values are widened to the first day of that period.
 */
export const getDatePickerDate = (value: string | null | undefined, type: DatePickerTypeType) => {
  if (!value) {
    return dayjs()
  }

  const parsed = dayjs(value, getDatePickerFormat(type), true)

  return parsed.isValid() ? parsed : dayjs(value)
}

/**
 * Re-expresses a value in the format of the given picker type.
 * Used when the picker type changes and the model has to be converted.
 */
export const convertDatePickerValue = (value: string | null | undefined, type: DatePickerTypeType) => {
  if (!value) {
    return value
  }

  return dayjs(value).format(getDatePickerFormat(type))
}

import { datePickerModelFormats } from '@/app/configs/datePicker'
import { DatePickerSelectType } from '@/app/constants/datePicker'
import { type DatePickerSelectTypeType, type DatePickerSwitchType, type DatePickerTypeType } from '@/app/types'

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

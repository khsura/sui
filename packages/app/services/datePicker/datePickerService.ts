import { type ModelRef, computed, ref } from 'vue'
import { datePickerItemHeightDefault, datePickerItemHeightDense } from '@khsura/sui/constants'
import { type PropsDatePicker } from '@khsura/sui/definitions'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { getDatePickerFormat } from '@khsura/sui/repositories'
import { type DatePickerSelectTypeType } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'

export const useDatePickerService = (props: PropsDatePicker, model: ModelRef<string | null | undefined>) => {
  const selectedType = ref<DatePickerSelectTypeType>(props.type)

  const selectedDate = computed(() => {
    return dayjs(model.value)
  })

  const selectedDateTemporary = ref(selectedDate.value.format(getDatePickerFormat(props.type)))

  const datePickerItemHeight = computed(() => {
    return props.dense ? datePickerItemHeightDense : datePickerItemHeightDefault
  })

  const datePickerItemHeightCssAttribute = computed(() => {
    return getNumericCssAttribute(datePickerItemHeight.value)
  })

  return {
    selectedType,
    selectedDate,
    selectedDateTemporary,
    datePickerItemHeight,
    datePickerItemHeightCssAttribute,
  }
}

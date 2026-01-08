import { type ModelRef, computed, ref } from 'vue'
import { datePickerItemHeightDefault, datePickerItemHeightDense } from '@/app/constants'
import { type PropsDatePicker } from '@/app/definitions'
import { getNumericCssAttribute } from '@/app/lib'
import { getDatePickerFormat } from '@/app/repositories'
import { type DatePickerSelectTypeType } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

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

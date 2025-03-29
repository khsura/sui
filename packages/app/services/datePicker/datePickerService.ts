import { type ModelRef, computed, ref } from 'vue'
import { datePickerItemHeightDefault, datePickerItemHeightDense } from '~/constants'
import { type PropsDatePicker } from '~/definitions'
import { getNumericCssAttribute } from '~/lib'
import { getDatePickerFormat } from '~/repositories'
import { type DatePickerSelectTypeType } from '~/types'
import dayjs from '~/vendors/dayjs'

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

import { datePickerItemHeightDefault, datePickerItemHeightDense } from '@sui/app/constants'
import { type PropsDatePicker } from '@sui/app/definitions'
import { getNumericCssAttribute } from '@sui/app/lib'
import { getDatePickerFormat } from '@sui/app/repositories'
import { type DatePickerSelectTypeType } from '@sui/app/types'
import dayjs from '@sui/app/vendors/dayjs'
import { computed, ref } from 'vue'
import { useModelService } from '../core'

export const useDatePickerService = (
  props: PropsDatePicker,
  emit: ((event: 'update:modelValue', value: string) => void) & ((event: 'change') => void),
) => {
  const selectedType = ref<DatePickerSelectTypeType>(props.type)

  const selectedDateFormatted = useModelService(props, emit, 'modelValue', {
    formatter: (value) => {
      return dayjs(value).format(getDatePickerFormat(props.type))
    },
    onChange: () => {
      emit('change')
    },
  })

  const selectedDate = computed(() => {
    return dayjs(selectedDateFormatted.value)
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
    selectedDateFormatted,
    selectedDate,
    selectedDateTemporary,
    datePickerItemHeight,
    datePickerItemHeightCssAttribute,
  }
}

import { type PropsDatePickerItemTitle } from '@sui/app/definitions'
import { type DatePickerItemEmits } from '@sui/app/types'
import { computed } from 'vue'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'

export const useDatePickerItemTitleService = (props: PropsDatePickerItemTitle, emit: DatePickerItemEmits) => {
  const { date, updateSelectedType, isLastSelectType } = useDatePickerItemCoreService(props, emit)

  const subtitle = computed(() => {
    return date.value.format(props.yearFormat)
  })

  const title = computed(() => {
    const format = props.type === 'month' ? props.monthFormat : props.dateFormat

    return date.value.format(format)
  })

  return {
    subtitle,
    title,
    isLastSelectType,
    updateSelectedType,
  }
}

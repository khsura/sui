import { computed } from 'vue'
import { type PropsDatePickerItemTitle } from '~/definitions'
import { type DatePickerItemEmits } from '~/types'
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

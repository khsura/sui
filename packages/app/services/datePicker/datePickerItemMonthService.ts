import { computed } from 'vue'
import { type PropsDatePickerItem } from '~/definitions'
import { type DatePickerItemEmits } from '~/types'
import dayjs from '~/vendors/dayjs'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'

export const useDatePickerItemMonthService = (props: PropsDatePickerItem, emit: DatePickerItemEmits) => {
  const { today, dateObject, selected, updateDate, min, max } = useDatePickerItemCoreService(props, emit)

  const months = computed(() => {
    const { year, day } = dateObject.value
    const selectedDate = selected.value.clone()
    const todayDate = today.value.clone()
    const minDate = min.value
    const maxDate = max.value

    return dayjs.monthsShort().map((title, month) => {
      return {
        value: month,
        title,
        isSelected: selectedDate.isSame({ year, month, day }, 'month'),
        isCurrent: todayDate.isSame({ year, month, day }, 'month'),
        isDisabled: !dayjs({ year, month, day }).isBetween(minDate, maxDate, 'month', '[]'),
        select: async () => {
          await updateDate({ year, month, day })
        },
      }
    })
  })

  return {
    months,
  }
}

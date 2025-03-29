import { computed } from 'vue'
import { type PropsDatePickerItem } from '~/definitions'
import { type DatePickerItemEmits } from '~/types'
import dayjs from '~/vendors/dayjs'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'

export const useDatePickerItemYearService = (props: PropsDatePickerItem, emit: DatePickerItemEmits) => {
  const { today, selected, updateDate, min, max, dateObject } = useDatePickerItemCoreService(props, emit)

  const years = computed(() => {
    const minDate = min.value
    const maxDate = max.value
    const startYear = minDate.year()
    const endYear = maxDate.year()
    const selectedDate = selected.value.clone()
    const todayDate = today.value.clone()
    const { month, day } = dateObject.value

    return Array(endYear - startYear + 1)
      .fill(0)
      .map<{
        value: number
        title: string
        isSelected: boolean
        isCurrent: boolean
        isDisabled: boolean
        select: () => void
      }>((_, i) => {
        const year = endYear - i

        return {
          value: year,
          title: `${year}年`,
          isSelected: selectedDate.isSame({ year }, 'year'),
          isCurrent: todayDate.isSame({ year }, 'year'),
          isDisabled: !dayjs({ year, month, day }).isBetween(minDate, maxDate, 'year', '[]'),
          select: async () => {
            await updateDate({ year })
          },
        }
      })
  })

  return {
    years,
  }
}

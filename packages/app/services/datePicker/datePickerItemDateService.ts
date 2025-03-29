import { computed } from 'vue'
import { type PropsDatePickerItem } from '~/definitions'
import { type DatePickerItemEmits } from '~/types'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'

export const useDatePickerItemDateService = (props: PropsDatePickerItem, emit: DatePickerItemEmits) => {
  const { date, today, selected, dateFormat, updateDate, min, max } = useDatePickerItemCoreService(props, emit)

  const startDateOfMonth = computed(() => {
    const startOfMonth = date.value.startOf('month')

    return startOfMonth.subtract(startOfMonth.day(), 'days')
  })

  const endDateOfMonth = computed(() => {
    const endOfMonth = date.value.endOf('month')

    return endOfMonth.add(7 - endOfMonth.day(), 'days')
  })

  const dates = computed(() => {
    const days = endDateOfMonth.value.diff(startDateOfMonth.value, 'day')
    const minDate = min.value
    const maxDate = max.value

    return Array(42)
      .fill(0)
      .map<{
        value: string
        isCurrent: boolean
        isSelected: boolean
        isCurrentMonth: boolean
        title: string
        isDisabled: boolean
        select: () => void
      }>((_, i) => {
        if (i >= days) {
          return {
            isCurrent: false,
            isSelected: false,
            isCurrentMonth: false,
            isDisabled: true,
            value: '',
            title: '',
            select: () => undefined,
          }
        }

        const target = startDateOfMonth.value.clone().add(i, 'days')
        const { years: year, months: month, date: day } = target.toObject()
        const isValid = target.isBetween(minDate, maxDate, 'date', '[]')

        return {
          isCurrent: today.value.isSame(target, 'day'),
          isSelected: selected.value.isSame(target, 'day'),
          isCurrentMonth: date.value.isSame(target, 'month'),
          isDisabled: !isValid,
          value: target.format(dateFormat.value),
          title: day.toString(),
          select: async () => {
            if (isValid) {
              await updateDate({ year, month, day })
            }
          },
        }
      })
  })

  return {
    dates,
  }
}

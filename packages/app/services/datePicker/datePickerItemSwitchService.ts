import { computed } from 'vue'
import { DatePickerSelectType } from '~/constants/datePicker'
import { type PropsDatePickerItemSwitch } from '~/definitions'
import { getDatePickerSwitchType } from '~/repositories/datePicker'
import { type DatePickerItemEmits, type DatePickerSelectTypeType, type DatePickerSwitchType } from '~/types'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'

export const useDatePickerItemSwitchService = (props: PropsDatePickerItemSwitch, emit: DatePickerItemEmits) => {
  const { updateDate, date, updateSelectedType, min, max } = useDatePickerItemCoreService(props, emit)

  const addDateTemporary = async (value: number, type: DatePickerSwitchType = 'month') => {
    const newDate = date.value.clone().add(value, type)
    const { years: year, months: month, date: day } = newDate.toObject()

    await updateDate(
      {
        year,
        month,
        day,
      },
      { onlyDateUpdate: true },
    )
  }

  const getDatePickerSwitchFormat = (type: DatePickerSelectTypeType) => {
    const switchType = getDatePickerSwitchType(type)

    const formats = {
      [DatePickerSelectType.date]: props.dateFormat,
      [DatePickerSelectType.month]: props.monthFormat,
      [DatePickerSelectType.year]: props.yearFormat,
    }

    return switchType ? formats[switchType] : undefined
  }

  const next = async (type?: DatePickerSwitchType | undefined) => {
    await addDateTemporary(1, type)
  }

  const prev = async (type: DatePickerSwitchType | undefined) => {
    await addDateTemporary(-1, type)
  }

  const switchType = computed(() => {
    return getDatePickerSwitchType(props.selectedType)
  })

  const switchTitle = computed(() => {
    return date.value.format(getDatePickerSwitchFormat(props.selectedType))
  })

  const canGoNext = computed(() => {
    if (props.selectedType === DatePickerSelectType.date) {
      return date.value.add(1, 'month').startOf('month').isAfter(max.value, 'date')
    }

    if (props.selectedType === DatePickerSelectType.month) {
      return date.value.add(1, 'year').startOf('year').isAfter(max.value, 'year')
    }

    return false
  })

  const canGoPrev = computed(() => {
    if (props.selectedType === DatePickerSelectType.date) {
      return date.value.subtract(1, 'month').endOf('month').isBefore(min.value, 'date')
    }

    if (props.selectedType === DatePickerSelectType.month) {
      return date.value.subtract(1, 'year').endOf('year').isBefore(min.value, 'year')
    }

    return false
  })

  return {
    next,
    prev,
    switchType,
    switchTitle,
    updateSelectedType,
    canGoNext,
    canGoPrev,
  }
}

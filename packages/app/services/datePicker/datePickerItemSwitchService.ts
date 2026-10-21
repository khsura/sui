import { computed } from 'vue'
import { useDatePickerItemCoreService } from './datePickerItemCoreService'
import { DatePickerSelectType } from '@/app/constants/datePicker'
import { type PropsDatePickerItemSwitch } from '@/app/definitions'
import { getDatePickerSwitchType } from '@/app/repositories/datePicker'
import { type DatePickerItemEmits, type DatePickerSelectTypeType, type DatePickerSwitchType } from '@/app/types'

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

  const prev = async (type?: DatePickerSwitchType | undefined) => {
    await addDateTemporary(-1, type)
  }

  const switchType = computed(() => {
    return getDatePickerSwitchType(props.selectedType)
  })

  const switchTitle = computed(() => {
    return date.value.format(getDatePickerSwitchFormat(props.selectedType))
  })

  /** The period the switch navigates through, `month` on the day view and `year` on the month view. */
  const switchUnit = computed(() => switchType.value)

  const isNextDisabled = computed(() => {
    if (!switchUnit.value) {
      return false
    }

    return date.value.add(1, switchUnit.value).startOf(switchUnit.value).isAfter(max.value, switchUnit.value)
  })

  const isPrevDisabled = computed(() => {
    if (!switchUnit.value) {
      return false
    }

    return date.value.subtract(1, switchUnit.value).endOf(switchUnit.value).isBefore(min.value, switchUnit.value)
  })

  return {
    next,
    prev,
    switchType,
    switchTitle,
    updateSelectedType,
    isNextDisabled,
    isPrevDisabled,
  }
}

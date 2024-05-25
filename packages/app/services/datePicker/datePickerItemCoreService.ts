import { DatePickerSelectType, DatePickerType } from '@khsura/sui/constants/datePicker'
import { type PropsDatePickerItem } from '@khsura/sui/definitions'
import { getDatePickerFormat } from '@khsura/sui/repositories/datePicker'
import { type DatePickerItemEmits, type DatePickerSelectTypeType } from '@khsura/sui/types'
import dayjs from '@khsura/sui/vendors/dayjs'
import { computed, nextTick } from 'vue'

export const useDatePickerItemCoreService = (props: PropsDatePickerItem, emit: DatePickerItemEmits) => {
  const date = computed(() => {
    return dayjs(props.date)
  })

  const dateObject = computed(() => {
    const { years: year, months: month, date: day } = date.value.toObject()

    return {
      year,
      month,
      day,
    }
  })

  const selected = computed(() => {
    return dayjs(props.selected)
  })

  const today = computed(() => {
    return dayjs(props.today)
  })

  const dateFormat = computed(() => {
    return getDatePickerFormat(props.type)
  })

  const max = computed(() => {
    return dayjs(props.max)
  })

  const min = computed(() => {
    return dayjs(props.min)
  })

  const getFixedSelectorType = (value: DatePickerSelectTypeType) => {
    if (value === DatePickerSelectType.date && props.type === DatePickerType.month) {
      return DatePickerSelectType.month
    }

    return value
  }

  const getNextSelectorType = (value: DatePickerSelectTypeType | undefined) => {
    if (value === DatePickerSelectType.year) {
      return getFixedSelectorType(DatePickerSelectType.month)
    }

    return getFixedSelectorType(DatePickerSelectType.date)
  }

  const isLastSelectType = computed(() => {
    return (
      (props.type === DatePickerType.month && props.selectedType === DatePickerSelectType.month) ||
      (props.type === DatePickerType.date && props.selectedType === DatePickerSelectType.date)
    )
  })

  const updateDate = async (
    value: { year?: number; month?: number; day?: number },
    { onlyDateUpdate = false }: { onlyDateUpdate?: boolean } = { onlyDateUpdate: false },
  ) => {
    const year = value.year ?? date.value.year()
    const month = value.month ?? date.value.month() + 1
    const day = props.type === 'month' ? 1 : value.day ?? date.value.date()
    const isValidDate = dayjs(`${year}-${month + 1}-${day}`, 'YYYY-M-D', true).isValid()
    const dateToSet = dayjs({ year, month, day: isValidDate ? day : 1 }).format(dateFormat.value)

    emit('update:date', dateToSet)
    await nextTick()

    if (!onlyDateUpdate) {
      updateSelectedType(getNextSelectorType(props.selectedType))

      await nextTick()
      if (isLastSelectType.value) {
        emit('update:selected', dateToSet)
      }
    }
  }

  const updateSelectedType = (value: DatePickerSelectTypeType | undefined) => {
    if (value === undefined) {
      return
    }

    emit('update:selected-type', getFixedSelectorType(value))
  }

  return {
    selected,
    date,
    dateObject,
    today,
    max,
    min,
    dateFormat,
    updateDate,
    isLastSelectType,
    updateSelectedType,
  }
}

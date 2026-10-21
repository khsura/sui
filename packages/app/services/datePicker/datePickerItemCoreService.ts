import { computed, nextTick } from 'vue'
import { DatePickerSelectType, DatePickerType } from '@/app/constants/datePicker'
import { type PropsDatePickerItem } from '@/app/definitions'
import { getDatePickerFormat } from '@/app/repositories/datePicker'
import { type DatePickerItemEmits, type DatePickerSelectTypeType } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

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
    if (props.type === DatePickerType.year) {
      return DatePickerSelectType.year
    }

    if (value === DatePickerSelectType.date && props.type === DatePickerType.month) {
      return DatePickerSelectType.month
    }

    return value
  }

  /**
   * Resolves the button props of a selectable item.
   * A selected item is rendered as a filled button in the given color, an unselected one as a text button.
   */
  const getItemButtonProps = (isSelected: boolean) => {
    return {
      variant: isSelected ? undefined : ('text' as const),
      color: isSelected ? props.color : undefined,
      colorThreshold: isSelected ? props.colorThreshold : undefined,
    }
  }

  const getNextSelectorType = (value: DatePickerSelectTypeType | undefined) => {
    if (value === DatePickerSelectType.year) {
      return getFixedSelectorType(DatePickerSelectType.month)
    }

    return getFixedSelectorType(DatePickerSelectType.date)
  }

  const isLastSelectType = computed(() => {
    return (
      (props.type === DatePickerType.year && props.selectedType === DatePickerSelectType.year) ||
      (props.type === DatePickerType.month && props.selectedType === DatePickerSelectType.month) ||
      (props.type === DatePickerType.date && props.selectedType === DatePickerSelectType.date)
    )
  })

  const updateDate = async (
    value: { year?: number; month?: number; day?: number },
    { onlyDateUpdate = false }: { onlyDateUpdate?: boolean } = { onlyDateUpdate: false },
  ) => {
    const year = value.year ?? date.value.year()
    const month = props.type === DatePickerType.year ? 0 : (value.month ?? date.value.month())

    const day =
      props.type === DatePickerType.year || props.type === DatePickerType.month ? 1 : (value.day ?? date.value.date())

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
    getItemButtonProps,
  }
}

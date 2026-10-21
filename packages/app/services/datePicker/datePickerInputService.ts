import { computed, type Ref } from 'vue'
import { type PropsDatePickerInput } from '@/app/definitions'
import {
  getDatePickerCompareUnit,
  getDatePickerDate,
  getDatePickerFormat,
  getDatePickerStepUnit,
} from '@/app/repositories/datePicker'
import { type DatePickerCompareUnit, type DatePickerStepUnit } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useDatePickerInputService = (props: PropsDatePickerInput, model: Ref<string | null | undefined>) => {
  const inputFormat = computed(() => getDatePickerFormat(props.type))
  const stepUnit = computed<DatePickerStepUnit>(() => getDatePickerStepUnit(props.type))
  const compareUnit = computed<DatePickerCompareUnit>(() => getDatePickerCompareUnit(props.type))
  const currentDate = computed(() => getDatePickerDate(model.value, props.type))
  const minDate = computed(() => (props.min ? dayjs(props.min) : null))
  const maxDate = computed(() => (props.max ? dayjs(props.max) : null))

  const isWithinBounds = (date: dayjs.Dayjs) => {
    const unit = compareUnit.value

    if (minDate.value && date.isBefore(minDate.value, unit)) {
      return false
    }

    if (maxDate.value && date.isAfter(maxDate.value, unit)) {
      return false
    }

    return true
  }

  const getSteppedDate = (amount: number) => {
    return currentDate.value.add(amount, stepUnit.value)
  }

  const isSteppable = computed(() => {
    return !!model.value && !props.disabled && !props.readonly
  })

  const canStepPrev = computed(() => isSteppable.value && isWithinBounds(getSteppedDate(-1)))
  const canStepNext = computed(() => isSteppable.value && isWithinBounds(getSteppedDate(1)))

  const step = (amount: number) => {
    const steppedDate = getSteppedDate(amount)

    if (!isSteppable.value || !isWithinBounds(steppedDate)) {
      return undefined
    }

    return steppedDate.format(inputFormat.value)
  }

  const stepPrev = () => step(-1)
  const stepNext = () => step(1)

  return {
    inputFormat,
    canStepPrev,
    canStepNext,
    stepPrev,
    stepNext,
  }
}

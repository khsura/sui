import { type Ref, ref, watch } from 'vue'
import { type PropsDatePicker } from '@/app/definitions'
import { getDatePickerFormat } from '@/app/repositories'
import { type DatePickerSelectTypeType } from '@/app/types'
import dayjs from '@/app/vendors/dayjs'

export const useDatePickerService = (props: PropsDatePicker, model: Ref<string | null | undefined>) => {
  const selectedType = ref<DatePickerSelectTypeType>(props.type)

  const formatValue = (value: string | null | undefined) => {
    return dayjs(value ?? undefined).format(getDatePickerFormat(props.type))
  }

  /** The date currently being browsed, it can differ from the committed selection. */
  const selectedDateTemporary = ref(formatValue(model.value))

  /**
   * Keeps the browsed date aligned with the committed value.
   * Browsing through the periods only changes the temporary date, so it is not affected by this.
   */
  watch(model, (value) => {
    selectedDateTemporary.value = formatValue(value)
  })

  return {
    selectedType,
    selectedDateTemporary,
  }
}

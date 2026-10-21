export interface DatePickerItemEmits {
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}
export type DatePickerSelectTypeType = 'year' | 'month' | 'date'
export type DatePickerSwitchType = 'year' | 'month'

export type DatePickerTypeType = 'month' | 'date' | 'year'

/** Unit used to shift a date value by one step (dayjs `add` unit). */
export type DatePickerStepUnit = 'day' | 'month' | 'year'

/** Unit used to compare a date value against the `min`/`max` bounds (dayjs `isBefore`/`isAfter` unit). */
export type DatePickerCompareUnit = 'date' | 'month' | 'year'

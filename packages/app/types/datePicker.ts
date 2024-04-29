export interface DatePickerItemEmits {
  (event: 'update:date', value: string): void
  (event: 'update:selected-type', value: string): void
  (event: 'update:selected', value: string): void
}
export type DatePickerSelectTypeType = 'year' | 'month' | 'date'
export type DatePickerSwitchType = 'year' | 'month'

export type DatePickerTypeType = 'month' | 'date'

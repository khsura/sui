export enum DatePickerSelectType {
  date = 'date',
  month = 'month',
  year = 'year',
}
export enum DatePickerType {
  date = 'date',
  month = 'month',
  year = 'year',
}
export const datePickerDefaultYearLimit = 100
/** Years before and after today that a date picker allows when `min` / `max` are not set. */
export const datePickerDefaultRangeYears = 5
export const datePickerWidth = '100%'
/**
 * Extra width, in `ch`, that SDatePickerInput reserves beyond one `ch` per character of its format.
 * `ch` is the width of a digit, and the format placeholder (`YYYY-MM-DD`) is wider than the digits it stands for.
 */
export const datePickerInputExtraWidthCh = 2

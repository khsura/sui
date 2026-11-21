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
 * Width, in `em`, that SDatePickerInput reserves per character of its placeholder.
 * The format placeholder (`YYYY-MM-DD`) is all wide capital letters, wider than `1ch` (one digit) each
 * in some fonts, such as the WebKit system font.
 */
export const datePickerInputPlaceholderCharWidthEm = 0.7

export interface SelectItem {
  text: string
  value: string | number | null
  disabled?: boolean
  [index: string]: unknown
}

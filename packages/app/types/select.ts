export interface SelectItem {
  text: string
  value: string | number | null | undefined
  disabled?: boolean
  [index: string]: unknown
}

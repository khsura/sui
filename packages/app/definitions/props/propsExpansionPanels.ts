import { type MaterialDesignIcon, type SizePropertyType } from '@khsura/sui/types'

export type PropsExpansionPanels = {
  expandIcon?: MaterialDesignIcon
  expandIconSize?: SizePropertyType
  multiple?: boolean
  mandatory?: boolean
  modelValue?: number[] | null
}

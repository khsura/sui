import { type MaterialDesignIcon, type SizePropertyType } from '@/app/types'

export type PropsExpansionPanels = {
  expandIcon?: MaterialDesignIcon
  expandIconSize?: SizePropertyType
  multiple?: boolean
  mandatory?: boolean
  modelValue?: number[] | null
}

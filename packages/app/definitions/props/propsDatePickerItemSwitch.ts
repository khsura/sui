import { type MaterialDesignIcon } from '@khsura/sui/types'
import { type PropsDatePickerItem } from './propsDatePickerItem'
import { type PropsDatePickerFormat } from './propsDatePickerFormat'

export type PropsDatePickerItemSwitch = PropsDatePickerItem &
  PropsDatePickerFormat & {
    prevIcon?: MaterialDesignIcon
    nextIcon?: MaterialDesignIcon
    prevAriaLabel?: string | null
    nextAriaLabel?: string | null
  }

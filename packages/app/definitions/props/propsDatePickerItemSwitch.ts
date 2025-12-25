import { type PropsDatePickerItem } from './propsDatePickerItem'
import { type PropsDatePickerFormat } from './propsDatePickerFormat'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsDatePickerItemSwitch = PropsDatePickerItem &
  PropsDatePickerFormat & {
    prevIcon?: MaterialDesignIcon
    nextIcon?: MaterialDesignIcon
    prevAriaLabel?: string | null
    nextAriaLabel?: string | null
  }

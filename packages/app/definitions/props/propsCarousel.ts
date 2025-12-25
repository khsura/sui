import { type PropsWindow } from './propsWindow'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsCarousel = {
  cycle?: boolean
  delimiterIcon?: MaterialDesignIcon
  height?: number | string
  controlsBackgroundColor?: string
  hideDelimiters?: boolean
  hideDelimiterBackground?: boolean
  interval?: number
  verticalDelimiters?: boolean | 'left' | 'right'
} & Omit<PropsWindow, 'mandatory'>

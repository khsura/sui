import { type PropsColor, type PropsDisabled, type PropsTag } from './core'
import { type PropsSingleGroup } from './propsSingleGroup'
import { type MaterialDesignIcon, type TouchHandlers } from '@/app/types'

export type PropsWindow = {
  nextIcon?: MaterialDesignIcon
  prevIcon?: MaterialDesignIcon
  hideArrows?: boolean
  touch?: boolean | TouchHandlers
  noAnimation?: boolean
  selectedClass?: string
  mandatory?: boolean
  continuous?: boolean
} & PropsColor &
  PropsDisabled &
  PropsTag &
  PropsSingleGroup

import { type PropsColor } from './core'
import { type STransition } from '@/app/constants'
import { type MaterialDesignIcon } from '@/app/types'

export type PropsBadge = PropsColor & {
  value?: boolean | undefined
  overlap?: boolean | undefined
  bottom?: boolean | undefined
  dot?: boolean | undefined
  left?: boolean | undefined
  tile?: boolean | undefined
  offsetX?: string | number | undefined
  offsetY?: string | number | undefined
  icon?: MaterialDesignIcon | undefined
  content?: string | number | undefined
  label?: string | undefined
  inline?: boolean | undefined
  transitionName?: STransition | undefined
  color?: string | undefined
}

import { type STransition } from '~/constants'
import { type PropsColor } from '~/definitions/props/core'
import { type MaterialDesignIcon } from '~/types'

export interface PropsBadge extends PropsColor {
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

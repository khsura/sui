import { type STransition } from '@sui/app/constants'
import { type PropsColor } from '@sui/app/definitions/props/core'
import { type MaterialDesignIcon } from '@sui/app/types'

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
  textColor: string | undefined
}

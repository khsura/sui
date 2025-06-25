import type { PropsPosition } from '@khsura/sui/definitions/props/core'

export interface PropsProgressLinear extends PropsPosition {
  backgroundColor?: string | null
  backgroundOpacity?: string | number | null
  color?: string
  size?: string | number | null
  indeterminate?: boolean
  value?: number | string
}

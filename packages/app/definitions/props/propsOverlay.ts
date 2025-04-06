import { type PropsPosition } from './core'

export type PropsOverlay = {
  zIndex?: number
  disabled?: boolean
  scrim?: boolean
  value?: boolean | null
  transition?: string
} & PropsPosition

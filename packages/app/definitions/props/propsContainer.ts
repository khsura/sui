import type { PropsColor, PropsTag } from './core'

export type PropsContainer = PropsColor &
  PropsTag & {
    fill?: boolean
    narrow?: boolean
    fluid?: boolean
    wide?: boolean
    padless?: boolean
  }

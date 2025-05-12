import type { PropsDisabled, PropsTag } from './core'
import type { PropsLink } from './propsLink'

export type PropsListItem = {
  lines?: number | null | undefined
  selectable?: boolean | null | undefined
  link?: boolean | null | undefined
} & PropsTag<'li' | 'div'> &
  PropsLink &
  PropsDisabled

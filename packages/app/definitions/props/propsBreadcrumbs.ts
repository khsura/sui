import { type BreadcrumbsItem } from '@khsura/sui/types'
import { type PropsTextColor } from './core'

export type PropsBreadcrumbs = {
  items?: BreadcrumbsItem[]
  divider?: string
  large?: boolean
} & PropsTextColor

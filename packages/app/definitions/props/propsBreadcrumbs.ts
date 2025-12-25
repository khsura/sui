import { type PropsTextColor } from './core'
import { type BreadcrumbsItem } from '@/app/types'

export type PropsBreadcrumbs = {
  items?: BreadcrumbsItem[]
  divider?: string
  large?: boolean
} & PropsTextColor

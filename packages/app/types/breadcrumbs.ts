import type { LinkLocation } from './link'

export interface BreadcrumbsItem {
  text: string | number
  link?: boolean
  disabled?: boolean
  href?: string
  to?: LinkLocation
}

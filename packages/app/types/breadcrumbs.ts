import { type RouteLocationRaw } from 'vue-router'

export interface BreadcrumbsItem {
  text: string | number
  link?: boolean
  disabled?: boolean
  href?: string
  to?: RouteLocationRaw
}

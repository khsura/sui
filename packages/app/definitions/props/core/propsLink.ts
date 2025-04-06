import { type RouteLocationRaw } from 'vue-router'

export type PropsLink = {
  href?: string | null | undefined
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string | null | undefined
  to?: RouteLocationRaw | null | undefined
}

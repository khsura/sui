import type { RouteLocationRaw } from 'vue-router'

export type PropsLink = {
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  to?: RouteLocationRaw | null | undefined
}

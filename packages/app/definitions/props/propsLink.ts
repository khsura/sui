import type { LinkLocation } from '@/app/types'

export type PropsLink = {
  href?: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string
  to?: LinkLocation | null | undefined
}

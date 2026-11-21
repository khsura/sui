import type { LinkLocation } from '@/app/types'

export type PropsLink = {
  href?: string | null | undefined
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string | null | undefined
  to?: LinkLocation | null | undefined
}

import { type HtmlTagName } from '@/app/types'

export interface PropsTag<T extends HtmlTagName = HtmlTagName> {
  tag?: T | undefined | null
}

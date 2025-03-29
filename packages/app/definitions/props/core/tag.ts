import { type HtmlTagName } from '~/types'

export interface PropsTag<T extends HtmlTagName = HtmlTagName> {
  tag?: T | undefined | null
}

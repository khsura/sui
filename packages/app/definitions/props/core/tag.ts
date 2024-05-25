import { type HtmlTagName } from '@khsura/sui/types'

export interface PropsTag<T extends HtmlTagName = HtmlTagName> {
  tag?: T | undefined
}

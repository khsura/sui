import { type HtmlTagName } from '@sui/app/types'

export interface PropsTag<T extends HtmlTagName = HtmlTagName> {
  tag?: T | undefined
}

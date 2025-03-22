import { type PropType } from 'vue'
import { type HtmlTagName } from '@khsura/sui/types'

export const propsTag = <T extends HtmlTagName = HtmlTagName>(defaults?: { tag?: T | undefined }) => {
  return {
    tag: {
      type: String as unknown as PropType<T | undefined>,
      default: defaults?.tag ?? 'div',
    },
  } as const
}

import { type HtmlTagName } from '@sui/app/types'

import { type PropType } from 'vue'

export const propsTag = <T extends HtmlTagName = HtmlTagName>(defaults?: { tag?: T | null | undefined }) => {
  return {
    tag: {
      type: String as unknown as PropType<T | null | undefined>,
      default: defaults?.tag ?? 'div',
    },
  } as const
}

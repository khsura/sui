import { computed } from 'vue'
import { type PropsTag } from '@khsura/sui/definitions'
import { type HtmlTagName } from '@khsura/sui/types'

export const useTagService = (props: PropsTag, options?: { defaults?: { tag?: HtmlTagName } }) => {
  const tagName = computed<HtmlTagName>(() => props.tag ?? options?.defaults?.tag ?? 'div')

  return {
    tagName,
  }
}

import { type PropsTag } from '@sui/app/definitions'
import { type HtmlTagName } from '@sui/app/types'
import { computed } from 'vue'

export const useTagService = (props: PropsTag, options?: { defaults?: { tag?: HtmlTagName } }) => {
  const tagName = computed<HtmlTagName>(() => props.tag ?? options?.defaults?.tag ?? 'div')

  return {
    tagName,
  }
}

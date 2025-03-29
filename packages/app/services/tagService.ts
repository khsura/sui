import { computed } from 'vue'
import { type PropsTag } from '~/definitions'
import { type HtmlTagName } from '~/types'

export const useTagService = (props: PropsTag, options?: { defaults?: { tag?: HtmlTagName } }) => {
  const tagName = computed<HtmlTagName>(() => props.tag ?? options?.defaults?.tag ?? 'div')

  return {
    tagName,
  }
}

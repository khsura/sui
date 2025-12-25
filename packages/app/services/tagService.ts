import { computed } from 'vue'
import { type PropsTag } from '@/app/definitions'
import { type HtmlTagName } from '@/app/types'

export const useTagService = (props: PropsTag, options?: { defaults?: { tag?: HtmlTagName } }) => {
  const tagName = computed<HtmlTagName>(() => props.tag ?? options?.defaults?.tag ?? 'div')

  return {
    tagName,
  }
}

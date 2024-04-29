import { type PropsLink, type PropsTag } from '@sui/app/definitions'
import { computed } from 'vue'

export const useLinkService = (props: PropsLink & PropsTag) => {
  const tag = computed(() => {
    if (props.to) {
      return 'router-link'
    }

    if (props.href) {
      return 'a'
    }

    return props?.tag ?? 'div'
  })

  const isLink = computed(() => {
    return ['router-link', 'a'].includes(tag.value)
  })

  return {
    tag,
    isLink,
  }
}

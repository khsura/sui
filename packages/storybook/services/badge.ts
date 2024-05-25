import { ref, watch } from 'vue'
import type { PropsBadge } from '@khsura/sui/definitions'

export const useBadgeService = <T extends Partial<PropsBadge>>(args: T) => {
  const content = ref<PropsBadge['content']>(0)

  watch(
    () => args.content,
    (v) => {
      content.value = v
    },
    {
      immediate: true,
    },
  )

  return { args, content }
}

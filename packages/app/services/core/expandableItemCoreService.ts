import { computed, getCurrentInstance } from 'vue'
import { type Ref } from 'vue'
import { z } from 'zod'

export const useExpandableItemCoreService = (isExpanded: Ref<boolean | null>) => {
  const instance = getCurrentInstance()

  const maxHeight = computed(() => {
    if (isExpanded.value === null) {
      return null
    }

    if (!isExpanded.value) {
      return 0
    }

    const parsedScrollHeight = z.number().safeParse(instance?.proxy?.$el?.scrollHeight ?? 0)
    const height = parsedScrollHeight.success ? parsedScrollHeight.data : 0
    const paddingY = 4 * 4 * 2
    const justInCase = 100

    return height + paddingY + justInCase
  })

  return {
    maxHeight,
  }
}

import type { Ref } from 'vue'
import { computed, isRef } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toComputed = <T extends Record<string, any>>(value: T | Ref<T>) => {
  return computed(() => {
    if (isRef(value)) {
      return value.value
    }

    return { ...value }
  })
}

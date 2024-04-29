import { type PropType } from 'vue'

export const propsScrollable = (defaults?: { scrollTarget: string | null }) => {
  return {
    scrollTarget: {
      type: String as PropType<string | null>,
      default: defaults?.scrollTarget ?? null,
    },
    scrollThreshold: {
      type: [String, Number] as PropType<string | number | null>,
      default: null,
    },
  } as const
}

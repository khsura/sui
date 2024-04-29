import { type PropType } from 'vue'

export const propsToggleButtonGroupVariant = <T extends 'underlined' | 'inset' | null>(defaults?: { variant?: T }) => {
  return {
    variant: {
      type: String as unknown as PropType<T | null | undefined>,
      default: defaults?.variant ?? null,
    },
  } as const
}

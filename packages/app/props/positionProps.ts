import { type PropType } from 'vue'

export const propsPosition = <T extends 'fixed' | 'absolute' = 'fixed' | 'absolute'>(defaults?: {
  position?: null | T
}) => {
  return {
    position: {
      type: String as unknown as PropType<T | undefined | null>,
      default: defaults?.position ?? null,
    },
  } as const
}

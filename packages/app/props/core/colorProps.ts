import { type PropType } from 'vue'
import { propsComponentTheme } from '@khsura/sui/props/core'
import { type ExposedAppColorType, type PresetColorType } from '@khsura/sui/types'

export const propsColor = <T extends PresetColorType | ExposedAppColorType | string = string>(defaults?: {
  color?: T | undefined
}) => {
  return {
    color: {
      type: String as unknown as PropType<T | undefined>,
      default: defaults?.color ?? undefined,
    },
    colorThreshold: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    ...propsComponentTheme(),
  } as const
}

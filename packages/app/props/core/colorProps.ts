import { propsComponentTheme } from '@sui/app/props/core'
import { type ExposedAppColorType, type PresetColorType } from '@sui/app/types'
import { type PropType } from 'vue'

export const propsColor = <T extends PresetColorType | ExposedAppColorType | string = string>(defaults?: {
  color?: T | undefined | null
}) => {
  return {
    color: {
      type: String as unknown as PropType<T | undefined | null>,
      default: defaults?.color ?? undefined,
    },
    colorThreshold: {
      type: Number as PropType<number | undefined>,
      default: undefined,
    },
    ...propsComponentTheme(),
  } as const
}

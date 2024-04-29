import { type PropType } from 'vue'

export const propsMeasurableStyles = (defaults?: {
  height?: string | number | null
  width?: string | number | null
}) => {
  return {
    height: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: defaults?.height,
    },
    width: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: defaults?.width,
    },
    maxHeight: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
    maxWidth: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
    minHeight: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
    minWidth: {
      type: [Number, String] as PropType<string | number | null | undefined>,
      default: null,
    },
  } as const
}

import { type PropType } from 'vue'
import { sizeProperties } from '@khsura/sui/configs'
import { type SizePropertyType, type SizePropertyUnionType } from '@khsura/sui/types'

export const propsSizePreset = () => {
  return {
    size: {
      type: [String] as PropType<SizePropertyType>,
      default: null,
      validator: (v: string | null) => {
        return v === null || sizeProperties.includes(v as SizePropertyType)
      },
    },
  }
}

export const propsSizeUnion = () => {
  return {
    size: {
      type: [String, Number] as PropType<SizePropertyUnionType>,
      default: null,
    },
  }
}

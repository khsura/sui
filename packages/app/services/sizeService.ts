import { computed } from 'vue'
import { sizeProperties } from '@khsura/sui/configs'
import { type PropsSizePreset, type PropsSizeUnion } from '@khsura/sui/definitions'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { type SizePropertyType } from '@khsura/sui/types'

export const useSizeService = <T extends PropsSizePreset | PropsSizeUnion>(props: T, config: { block: string }) => {
  const isPresetSize = computed(() => sizeProperties.includes(props.size as SizePropertyType))

  const classListSize = computed(() => {
    if (!isPresetSize.value) {
      return {}
    }

    return {
      [`s_${config.block}--size__${props.size}`]: isPresetSize.value,
    }
  })

  const styleListSize = computed((): { fontSize?: string } => {
    if (isPresetSize.value) {
      return {}
    }

    const fontSize = getNumericCssAttribute(props.size)

    return fontSize
      ? {
          fontSize,
        }
      : {}
  })

  return {
    classListSize,
    styleListSize,
    isPresetSize,
  }
}

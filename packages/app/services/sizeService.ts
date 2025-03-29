import { computed } from 'vue'
import { sizeProperties } from '~/configs'
import { type PropsSizePreset, type PropsSizeUnion } from '~/definitions'
import { getNumericCssAttribute } from '~/lib'
import { type SizePropertyType } from '~/types'

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

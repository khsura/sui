import { type PropsTextColor } from '@sui/app/definitions'
import { useColorRepository } from '@sui/app/repositories/colorRepository'
import { computed } from 'vue'

export const useTextColorService = (props: PropsTextColor) => {
  const { getIsPresetColor, getIsPredefinedPresetColor } = useColorRepository()
  const isPredefinedPresetColor = computed(() => getIsPredefinedPresetColor(props.color))
  const isPresetColor = computed(() => getIsPresetColor(props.color))

  const styleListTextColor = computed(() => {
    return isPredefinedPresetColor.value || !props.color ? {} : { color: props.color, fill: props.color }
  })

  const classListTextColor = computed(() => {
    if (isPredefinedPresetColor.value) {
      return {
        [`s_textColor__${props.color}`]: true,
      }
    }

    return {}
  })

  return {
    styleListTextColor,
    classListTextColor,
    isPresetColor,
  }
}

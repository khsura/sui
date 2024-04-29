import { type PropsTextColor } from '@sui/app/definitions'
import { getIsPresetColor } from '@sui/app/repositories/colorRepository'
import { computed } from 'vue'

export const useTextColorService = (props: PropsTextColor) => {
  const isPresetColor = computed(() => getIsPresetColor(props.color ?? null))

  const styleListTextColor = computed(() => {
    return isPresetColor.value || !props.color ? {} : { color: props.color, fill: props.color }
  })

  const classListTextColor = computed(() => {
    if (isPresetColor.value) {
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

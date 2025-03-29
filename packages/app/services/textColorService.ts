import { toReactive } from '@vueuse/core'
import { type Ref, computed } from 'vue'
import { type PropsTextColor } from '~/definitions'
import { useColorRepository } from '~/repositories/colorRepository'

export const useTextColorService = (data: PropsTextColor | Ref<Partial<PropsTextColor>>) => {
  const props = toReactive(data)
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

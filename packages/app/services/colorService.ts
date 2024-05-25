import { AppTheme } from '@khsura/sui/constants/app'
import { type PropsColor } from '@khsura/sui/definitions/props'
import { isDarkColor } from '@khsura/sui/lib/color'
import { useColorRepository } from '@khsura/sui/repositories/colorRepository'
import { type Ref, computed, isRef } from 'vue'
import { getCssColor } from '@khsura/sui/helpers/colorHelpers'
import { useAppProviderRepository } from '@khsura/sui/repositories'
import { toReactive } from '@vueuse/core'

export const useColorService = (
  data: PropsColor | Ref<Partial<PropsColor>>,
  options: { isText?: boolean | Ref<boolean | null | undefined> } = { isText: false },
) => {
  const props = toReactive(data)
  const { config } = useAppProviderRepository()
  const { getBackgroundColorAttributes, getIsPresetColor } = useColorRepository()

  const isText = computed(() => {
    if (options.isText === undefined) {
      return false
    }

    if (isRef(options.isText)) {
      return options.isText.value
    }

    return options.isText
  })

  const isPresetColor = computed(() => {
    return getIsPresetColor(props.color)
  })

  const hasPresetTextColor = computed(() => {
    return isPresetColor.value && isText.value
  })

  const textColorClasses = computed(() => {
    if (!props.color) {
      return {}
    }

    if (hasPresetTextColor.value) {
      return { [`s_textColor__${props.color}`]: true }
    }

    if (isText.value && !isPresetColor.value) {
      return {}
    }

    const presetColor: string | undefined = config.themes[config.theme].presetColors[props.color]
    const backgroundColor = presetColor ?? getCssColor(props.color) ?? props.color
    const noNeedToSetTextColor = isPresetColor.value && props.colorThreshold === undefined
    const isDark = noNeedToSetTextColor ? null : isDarkColor(backgroundColor, props.colorThreshold)

    if (props.theme === AppTheme.dark || isDark === true) {
      return { s_dark: true }
    }

    if (props.theme === AppTheme.light || isDark === false) {
      return { s_light: true }
    }

    return {}
  })

  const backgroundColorAttributes = computed(() => {
    if (isText.value) {
      return { class: {}, style: {} }
    }

    return getBackgroundColorAttributes(props.color ?? null)
  })

  const styleListColor = computed(() => {
    const color = props.color ?? undefined

    if (!color) {
      return {}
    }

    if (isText.value && !hasPresetTextColor.value) {
      return {
        color,
      }
    }

    return backgroundColorAttributes.value.style
  })

  const classListColor = computed(() => {
    return {
      ...backgroundColorAttributes.value.class,
      ...textColorClasses.value,
    }
  })

  const colorVariable = computed(() => {
    if (!props.color) {
      return null
    }

    if (getIsPresetColor(props.color)) {
      return `var(--s-color-${props.color})`
    }

    return props.color
  })

  return {
    styleListColor,
    classListColor,
    colorVariable,
  }
}

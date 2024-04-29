import { AppTheme } from '@sui/app/constants/app'
import { type PropsColor } from '@sui/app/definitions'
import { isDarkColor } from '@sui/app/lib/color'
import { useColorRepository } from '@sui/app/repositories/colorRepository'
import { computed, isRef } from 'vue'
import { type Ref } from 'vue'
import { useAppProviderService } from './appProviderService'

export const useColorService = (
  props: PropsColor,
  options: { isText?: boolean | Ref<boolean> } = { isText: false },
) => {
  const { config } = useAppProviderService()
  const { getIsPresetColor, getBackgroundColorAttributes } = useColorRepository()

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
    const backgroundColor = presetColor ?? props.color
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

    return getBackgroundColorAttributes(props.color)
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

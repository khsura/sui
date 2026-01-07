import { toReactive } from '@vueuse/core'
import { type Ref, computed, inject, isRef } from 'vue'
import { AppTheme } from '@/app/constants/app'
import { type PropsColor } from '@/app/definitions'
import { getCssColor } from '@/app/helpers/colorHelpers'
import { isDarkColor } from '@/app/lib/color'
import { useColorRepository } from '@/app/repositories/colorRepository'
import { ProviderName } from '@/app/configs'

export const useColorService = (
  data: PropsColor | Ref<Partial<PropsColor>>,
  options: { isText?: boolean | Ref<boolean | null | undefined> } = { isText: false },
) => {
  const props = toReactive(data)
  const appState = inject(ProviderName.app)
  const { getBackgroundColorAttributes, getIsPresetColor, getIsAppColor } = useColorRepository()

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
    return getIsPresetColor(props.color) || getIsAppColor(props.color)
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

    const presetColor: string | undefined = appState?.themes[appState.theme].presetColors[props.color]
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

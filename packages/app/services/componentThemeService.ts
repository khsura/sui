import { type PropsComponentTheme } from '@sui/app/definitions'
import { computed } from 'vue'
import { AppTheme } from '../constants/app'

export const useComponentThemeService = (props: PropsComponentTheme) => {
  const classes = {
    [AppTheme.dark]: 'k_dark',
    [AppTheme.light]: 'k_light',
  }

  const themeClasses = computed(() => {
    if (props.theme) {
      return {
        [classes[props.theme]]: true,
      }
    }

    return {}
  })

  return {
    themeClasses,
  }
}

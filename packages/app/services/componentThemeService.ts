import { type PropsComponentTheme } from '@sui/app/definitions'
import { computed } from 'vue'
import { AppTheme } from '@sui/app/constants'

export const useComponentThemeService = (props: PropsComponentTheme) => {
  const classes = {
    [AppTheme.dark]: 's_dark',
    [AppTheme.light]: 's_light',
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

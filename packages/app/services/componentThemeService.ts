import { computed } from 'vue'
import { AppTheme } from '@/app/constants'
import { type PropsComponentTheme } from '@/app/definitions'

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

import { type PropType } from 'vue'
import { type AppThemeType } from '~/types'

export const propsComponentTheme = () => {
  return {
    theme: {
      type: String as PropType<AppThemeType | undefined>,
      default: undefined,
    },
  }
}

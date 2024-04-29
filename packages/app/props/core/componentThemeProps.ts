import { type AppThemeType } from '@sui/app/types'
import { type PropType } from 'vue'

export const propsComponentTheme = () => {
  return {
    theme: {
      type: String as PropType<AppThemeType | null | undefined>,
      default: undefined,
    },
  }
}

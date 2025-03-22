import { type PropType } from 'vue'
import { type AppThemeType } from '@khsura/sui/types'

export const propsComponentTheme = () => {
  return {
    theme: {
      type: String as PropType<AppThemeType | undefined>,
      default: undefined,
    },
  }
}

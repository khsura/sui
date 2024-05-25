import { type AppThemeType } from '@khsura/sui/types'
import { type PropType } from 'vue'

export const propsComponentTheme = () => {
  return {
    theme: {
      type: String as PropType<AppThemeType | undefined>,
      default: undefined,
    },
  }
}

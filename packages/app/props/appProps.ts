import { type AppTheme } from '@sui/app/constants'
import { type PropType } from 'vue'
import { getBrowserTheme } from '@sui/app/helpers'
import { propsLayoutProvider } from './layoutProviderProps'

export const propsApp = () => {
  return {
    ...propsLayoutProvider({ app: true }),
    theme: {
      type: String as PropType<AppTheme>,
      default: getBrowserTheme(),
    },
  }
}

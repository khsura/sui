import { type AppTheme } from '@khsura/sui/constants'
import { type PropType } from 'vue'
import { getBrowserTheme } from '@khsura/sui/helpers'
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

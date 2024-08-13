import { propsLayoutProvider } from './layoutProviderProps'

export const propsApp = () => {
  return {
    ...propsLayoutProvider({ app: true }),
  }
}

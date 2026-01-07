import { defaultAppPluginName } from '@/app/constants'

export const getPluginName = <T extends string = 'sui'>(name?: string | symbol) => {
  return (name ?? defaultAppPluginName) as T
}

import { reactive } from 'vue'
import { merge } from '@/app/vendors/deepmerge'
import { defaultAppConfig } from '@/app/configs/app'
import { type AppState, type AppStateOptions } from '@/app/definitions'

export const createAppStore = <T extends string = 'sui'>(config?: AppStateOptions, name?: T) => {
  return reactive<AppState<T>>(merge.all<AppState<T>>([defaultAppConfig, config as AppState<T>, { name }]))
}

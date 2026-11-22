import { reactive, type Reactive } from 'vue'
import { defaultAppConfig } from '@/app/configs/app'
import { type AppState, type AppStateOptions } from '@/app/definitions'
import { merge } from '@/app/vendors/merge'

export const createAppStore = <T extends string = 'sui'>(name: T, config?: AppStateOptions): Reactive<AppState<T>> => {
  const mergedConfig: AppState<T> = merge({}, defaultAppConfig, { ...config }, { name })

  return reactive<AppState<T>>({ ...mergedConfig })
}

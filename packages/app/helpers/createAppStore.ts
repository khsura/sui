import { reactive } from 'vue'
import { merge } from '@/app/vendors/deepmerge'
import { defaultAppConfig } from '@/app/configs/app'
import { type AppState } from '@/app/definitions'

export const createAppStore = <T extends string = 'sui'>(config?: Partial<AppState<T>>, name?: T) => {
  return reactive(merge.all<Partial<AppState<T>>>([defaultAppConfig, config ?? {}, { name }]))
}

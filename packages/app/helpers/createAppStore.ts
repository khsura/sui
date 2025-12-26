import { merge } from 'lodash'
import { reactive } from 'vue'
import { defaultAppConfig } from '@/app/configs/app'
import { type AppState, type AppStateOptions } from '@/app/definitions'

export const createAppStore = <T extends string = 'sui'>(config?: Partial<AppStateOptions>, name?: T) => {
  return reactive<AppState>(merge(defaultAppConfig, config, { name }))
}

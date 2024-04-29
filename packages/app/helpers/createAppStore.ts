import { defaultAppConfig } from '@sui/app/configs/app'
import { type AppState, type AppStateOptions } from '@sui/app/types'
import lodash from 'lodash'
import { reactive } from 'vue'

export const createAppStore = <T extends string = 'sui'>(config?: Partial<AppStateOptions>, name?: T) => {
  return reactive<AppState>(lodash.merge(defaultAppConfig, config, { name }))
}

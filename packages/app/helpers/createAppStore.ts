import lodash from 'lodash'
import { reactive } from 'vue'
import { defaultAppConfig } from '~/configs/app'
import { type AppState, type AppStateOptions } from '~/types'

export const createAppStore = <T extends string = 'sui'>(config?: Partial<AppStateOptions>, name?: T) => {
  return reactive<AppState>(lodash.merge(defaultAppConfig, config, { name }))
}

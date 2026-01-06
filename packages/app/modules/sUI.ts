import { type InjectionKey, type Plugin } from 'vue'
import { resize, scroll } from '@/app/directives'
import { createAppStore } from '@/app/helpers/createAppStore'
import { listenDisplayChange } from '@/app/helpers/display'
import type { AppState, AppStateOptions } from '@/app/definitions'
import { getPluginName } from '@/app/lib/getPluginName'

export const createSUI = <T extends string = 'sui'>(options?: AppStateOptions, name?: T) => {
  const appName = getPluginName<T>(name)
  const store = createAppStore<T>(appName, options)

  const plugin: Plugin = {
    install: (app) => {
      if (app.config.globalProperties[`$${appName}`]) {
        console.error(`${appName} is already exist. app may not work properly`)

        return
      }

      app.config.globalProperties[`$${appName}`] = store
      app.provide(appName as unknown as InjectionKey<AppState<T>>, store as unknown as AppState<T>)

      app.directive('scroll', scroll)
      app.directive('resize', resize)
      listenDisplayChange()
    },
  }

  return plugin
}

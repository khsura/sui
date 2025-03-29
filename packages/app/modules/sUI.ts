import { type Plugin } from 'vue'
import { resize, scroll } from '~/directives'
import { createAppStore } from '~/helpers/createAppStore'
import { listenDisplayChange } from '~/helpers/display'
import { type AppStateOptions } from '~/types'

export const createSUI = <T extends string = 'sui'>(options?: AppStateOptions, name?: T) => {
  const appName = name ?? 'sui'
  const store = createAppStore<T>(options, name)

  const plugin: Plugin = {
    install: (app) => {
      if (app.config.globalProperties[`$${appName}`]) {
        console.error(`${appName} is already exist. app may not work properly`)

        return
      }

      app.config.globalProperties[`$${appName}`] = store
      app.provide(appName, store)
      app.directive('scroll', scroll)
      app.directive('resize', resize)
      listenDisplayChange()
    },
  }

  return plugin
}

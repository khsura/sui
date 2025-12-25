import { type Plugin } from 'vue'
import { resize, scroll } from '@/app/directives'
import { createAppStore } from '@/app/helpers/createAppStore'
import { listenDisplayChange } from '@/app/helpers/display'
import { type AppStateOptions } from '@/app/definitions'

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

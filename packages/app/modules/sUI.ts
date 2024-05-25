import { resize, scroll } from '@khsura/sui/directives'
import { createAppStore } from '@khsura/sui/helpers/createAppStore'
import { listenDisplayChange } from '@khsura/sui/helpers/display'
import { i18n } from '@khsura/sui/plugins/i18n'
import { type AppStateOptions } from '@khsura/sui/types'
import portalVue from 'portal-vue'
import { type Plugin } from 'vue'

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
      app.use(i18n)
      app.use(portalVue)
      app.directive('scroll', scroll)
      app.directive('resize', resize)
      listenDisplayChange()
    },
  }

  return plugin
}

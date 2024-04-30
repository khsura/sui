import { resize, scroll } from '@sui/app/directives'
import { createAppStore } from '@sui/app/helpers/createAppStore'
import { listenDisplayChange } from '@sui/app/helpers/display'
import { i18n } from '@sui/app/plugins/i18n'
import { type AppStateOptions } from '@sui/app/types'
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

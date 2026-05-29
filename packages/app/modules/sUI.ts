import { type InjectionKey, type Plugin } from 'vue'
import { resize, scroll } from '@/app/directives'
import { createAppStore } from '@/app/helpers/createAppStore'
import { getThemeColorMode } from '@/app/helpers/themeColorMode'
import { listenDisplayChange } from '@/app/helpers/display'
import type { AppState, AppStateOptions } from '@/app/definitions'
import { getPluginName } from '@/app/lib/getPluginName'

export const createSUI = <T extends string = 'sui'>(options?: AppStateOptions, name?: T) => {
  const appName = getPluginName<T>(name)
  // `theme` is the user's *preference* (may be 'auto'); it must not populate the
  // resolved `appState.theme`. Route it to useColorMode as the initial value.
  const { theme: themePreference = 'auto', ...restOptions } = options ?? {}
  const store = createAppStore<T>(appName, restOptions)

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

      // Reactive color mode (global singleton): persists to localStorage, follows
      // OS in 'auto', writes <html data-theme>, and mirrors the resolved value
      // into store.theme.
      getThemeColorMode(store as unknown as AppState, themePreference)
    },
  }

  return plugin
}

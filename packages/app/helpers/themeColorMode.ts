import { effectScope, watchSyncEffect } from 'vue'
import { useColorMode, type UseColorModeReturn } from '@vueuse/core'
import type { AppState } from '@/app/definitions'
import type { AppThemeType, ThemePreference } from '@/app/types'

const registry = new Map<string, UseColorModeReturn<ThemePreference>>()

/**
 * Returns the single useColorMode instance for `appName`, creating it on first
 * call. When `appState` is provided on the creating call, a synchronous effect
 * mirrors the resolved color mode into `appState.theme` (always 'light'|'dark')
 * and the persisted preference into `appState.themePreference`.
 *
 * The instance is created in a detached effect scope so it persists for the
 * app's lifetime without being tied to a component instance.
 */
export const getThemeColorMode = (
  appName: string,
  appState?: AppState,
  initialValue: ThemePreference = 'auto',
): UseColorModeReturn<ThemePreference> => {
  const existing = registry.get(appName)

  if (existing) {
    return existing
  }

  const scope = effectScope(true)

  const colorMode = scope.run(() => {
    const mode = useColorMode({
      selector: 'html',
      attribute: 'data-theme',
      storageKey: `${appName}-theme`,
      initialValue,
    })

    if (appState) {
      watchSyncEffect(() => {
        appState.theme = mode.value as AppThemeType
        appState.themePreference = mode.store.value as ThemePreference
      })
    }

    return mode
  }) as UseColorModeReturn<ThemePreference>

  registry.set(appName, colorMode)

  return colorMode
}

/** Test-only: clear the registry so each test starts from a fresh instance. */
export const __resetThemeColorModeRegistry = () => {
  registry.clear()
}

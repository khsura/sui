import { effectScope, watchSyncEffect } from 'vue'
import { useColorMode, type UseColorModeReturn } from '@vueuse/core'
import type { AppState } from '@/app/definitions'
import type { AppThemeType, ThemePreference } from '@/app/types'

const STORAGE_KEY = 'sui-theme'
let scope: ReturnType<typeof effectScope> | null = null
let colorMode: UseColorModeReturn<ThemePreference> | null = null
let boundStates = new WeakSet<AppState>()

/**
 * Returns the single, global useColorMode instance, creating it on first call.
 * Theme is intentionally global across all SUI app instances on the page — they
 * share one persisted preference (`localStorage['sui-theme']`) and one DOM hook
 * (`<html data-theme>`).
 *
 * When `appState` is provided and has not already been bound, a synchronous
 * effect mirrors the resolved color mode into `appState.theme` (always
 * `'light' | 'dark'`) and the persisted preference into `appState.themePreference`.
 * Each app's install hook passes its store once; subsequent retrievals (e.g.
 * from `useThemeService`) omit `appState`.
 *
 * The instance lives in a detached effect scope for the page's lifetime.
 *
 * `initialValue` is honoured only on the first call (when the singleton is
 * created); subsequent calls reuse the existing instance and ignore the
 * argument. This matches the global-by-design intent — the first app's
 * configured `theme` seeds the page's preference if `localStorage['sui-theme']`
 * is empty.
 */
export const getThemeColorMode = (
  appState?: AppState,
  initialValue: ThemePreference = 'auto',
): UseColorModeReturn<ThemePreference> => {
  if (!scope || !colorMode) {
    scope = effectScope(true)
    // scope was just created above — scope.run cannot return undefined here.
    colorMode = scope.run(() =>
      useColorMode({
        selector: 'html',
        attribute: 'data-theme',
        storageKey: STORAGE_KEY,
        initialValue,
      }),
    ) as UseColorModeReturn<ThemePreference>
  }

  if (appState && !boundStates.has(appState)) {
    boundStates.add(appState)
    const mode = colorMode

    scope.run(() => {
      watchSyncEffect(() => {
        appState.theme = mode.value as AppThemeType
        appState.themePreference = mode.store.value as ThemePreference
      })
    })
  }

  return colorMode
}

/** Test-only: stop the scope and reset singleton + bound-state tracking. */
export const __resetThemeColorModeRegistry = () => {
  scope?.stop()
  scope = null
  colorMode = null
  boundStates = new WeakSet<AppState>()
}

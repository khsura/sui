import { inject } from 'vue'
import { getPluginName } from '@/app/lib/getPluginName'
import type { AppState } from '@/app/definitions'
import { ProviderName } from '@/app/configs'

export const useAppProviderRepository = (appName?: string | symbol) => {
  const appState = inject<AppState>(ProviderName.app) ?? inject<AppState>(getPluginName(appName))

  if (!appState) {
    throw new Error(`AppState for ${appName?.toString()} not found`)
  }

  return {
    appState,
  }
}

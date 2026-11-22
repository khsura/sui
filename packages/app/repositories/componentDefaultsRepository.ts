import { inject, toValue } from 'vue'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'
import { ProviderName } from '@/app/configs'
import type { ComponentDefaultsOptions, ComponentsOption } from '@/app/definitions'

/**
 * Where a component reads its configured defaults from. A scoped layer provided under
 * `ProviderName.componentDefaults` (already merged with its parent) takes over; otherwise the
 * app-level `createSUI({ defaults })`. Both getters read reactive state, so callers re-render
 * when the defaults change.
 */
export const useComponentDefaultsRepository = () => {
  const { appState } = useAppProviderRepository()
  const scopedDefaults = inject(ProviderName.componentDefaults, null)

  const getDefaults = (): ComponentDefaultsOptions | undefined =>
    scopedDefaults ? toValue(scopedDefaults) : appState.defaults

  const getLegacyComponents = (): ComponentsOption | undefined => appState.components

  return {
    getDefaults,
    getLegacyComponents,
  }
}

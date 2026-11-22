import type { ComponentDefaultsOptions } from '../componentDefaults'

export type PropsDefaultsProvider = {
  /**
   * Component defaults for everything inside, typed like `createSUI({ defaults })`: per component
   * (`{ SButton: { size: 'small' } }`) and `global`. Merged onto the nearest outer layer (an outer
   * `SDefaultsProvider` or the app-level defaults): inner wins per prop, explicit props still win over both.
   */
  defaults?: ComponentDefaultsOptions | undefined
}

import type { DensityType } from '@/app/types'

export type PropsDensity = {
  /**
   * Vertical density: `default` (today's look), `comfortable` (one step tighter) or `compact`
   * (two steps). Set it once for the app with `createSUI({ defaults: { global: { density } } })`
   * instead of overriding heights or paddings per component.
   */
  density?: DensityType | null | undefined
}

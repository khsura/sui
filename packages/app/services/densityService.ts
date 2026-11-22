import { computed } from 'vue'
import { densities } from '@/app/configs'
import { Density } from '@/app/constants'
import type { PropsDensity } from '@/app/definitions'
import type { DensityType } from '@/app/types'

const isDensity = (value: unknown): value is DensityType => densities.some((density) => density === value)

/**
 * Resolves a component's density and the class that switches its CSS variables.
 * Pass the props returned by `useComponentDefaultsService`, so `density` already follows
 * explicit prop → component default → `defaults.global.density` → `default`.
 * `default` adds no class, so it renders exactly the pre-density styles.
 */
export const useDensityService = (props: PropsDensity) => {
  const density = computed<DensityType>(() => (isDensity(props.density) ? props.density : Density.default))

  const classListDensity = computed((): Record<string, boolean> => {
    if (density.value === Density.default) {
      return {}
    }

    return { [`s_density--${density.value}`]: true }
  })

  return {
    density,
    classListDensity,
  }
}

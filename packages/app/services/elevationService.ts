import { computed } from 'vue'
import { type PropsElevation } from '~/definitions'
import { getNumericValue } from '~/lib/getNumericValue'

export const useElevationService = (props: PropsElevation) => {
  const classListElevation = computed(() => {
    const elevation = getNumericValue(props.elevation)

    if (elevation === null || elevation > 24) {
      return {}
    }

    return { [`s_elevation__${elevation}`]: true }
  })

  return {
    classListElevation,
  }
}

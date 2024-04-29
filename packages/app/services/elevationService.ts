import { type PropsElevation } from '@sui/app/definitions'
import { getNumericValue } from '@sui/app/lib/getNumericValue'
import { computed } from 'vue'

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

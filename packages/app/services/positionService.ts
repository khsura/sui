import { type propsLayout } from '@sui/app/props/layoutProps'
import { type propsPosition } from '@sui/app/props/positionProps'
import { computed } from 'vue'
import { type ExtractPropTypes } from 'vue'

export const usePositionService = (
  props: ExtractPropTypes<ReturnType<typeof propsPosition>> & Partial<ExtractPropTypes<ReturnType<typeof propsLayout>>>,
  options?: { ignoreApp?: boolean },
) => {
  const isAbsolutePosition = computed(() => {
    return props.position === 'absolute'
  })

  const isFixedPosition = computed(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return (!options?.ignoreApp && props.app) || props.position === 'fixed'
  })

  const classListPosition = computed(() => {
    return {
      s_position__fixed: isFixedPosition.value,
      s_position__absolute: isAbsolutePosition.value,
    }
  })

  return {
    classListPosition,
    isAbsolutePosition,
    isFixedPosition,
  }
}

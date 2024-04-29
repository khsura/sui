import { type propsLayout } from '@sui/app/props/layoutProps'
import { type propsPosition } from '@sui/app/props/positionProps'
import { computed, type ExtractPropTypes } from 'vue'
import { getCleanSetObject } from '@sui/app/lib/getCleanSetObject'
import { getIsAbsolutePosition, getIsFixedPosition, getIsFixedOrAbsolutePosition } from '@sui/app/repositories'

export const usePositionService = (
  props: ExtractPropTypes<ReturnType<typeof propsPosition>> & Partial<ExtractPropTypes<ReturnType<typeof propsLayout>>>,
  options?: { ignoreApp?: boolean },
) => {
  const isAbsolutePosition = computed(() => {
    return getIsAbsolutePosition(props)
  })

  const isFixedPosition = computed(() => {
    return getIsFixedPosition(props, options)
  })

  const classListPosition = computed(() => {
    return getCleanSetObject({
      s_position__fixed: isFixedPosition.value,
      s_position__absolute: isAbsolutePosition.value,
    })
  })

  const isFixedOrAbsolutePosition = computed(() => {
    return getIsFixedOrAbsolutePosition(props, options)
  })

  return {
    classListPosition,
    isAbsolutePosition,
    isFixedPosition,
    isFixedOrAbsolutePosition,
  }
}

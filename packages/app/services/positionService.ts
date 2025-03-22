import { computed, type ExtractPropTypes } from 'vue'
import { getCleanSetObject } from '@khsura/sui/lib/getCleanSetObject'
import { type propsLayout } from '@khsura/sui/props/layoutProps'
import { type propsPosition } from '@khsura/sui/props/positionProps'
import { getIsAbsolutePosition, getIsFixedPosition, getIsFixedOrAbsolutePosition } from '@khsura/sui/repositories'

export const usePositionService = (
  props: ExtractPropTypes<ReturnType<typeof propsPosition>> & Partial<ExtractPropTypes<ReturnType<typeof propsLayout>>>,
) => {
  const isAbsolutePosition = computed(() => {
    return getIsAbsolutePosition(props)
  })

  const isFixedPosition = computed(() => {
    return getIsFixedPosition(props)
  })

  const classListPosition = computed(() => {
    return getCleanSetObject({
      s_position__fixed: isFixedPosition.value,
      s_position__absolute: isAbsolutePosition.value,
    })
  })

  const isFixedOrAbsolutePosition = computed(() => {
    return getIsFixedOrAbsolutePosition(props)
  })

  return {
    classListPosition,
    isAbsolutePosition,
    isFixedPosition,
    isFixedOrAbsolutePosition,
  }
}

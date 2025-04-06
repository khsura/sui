import { computed } from 'vue'
import { getCleanSetObject } from '@khsura/sui/lib/getCleanSetObject'
import { getIsAbsolutePosition, getIsFixedPosition, getIsFixedOrAbsolutePosition } from '@khsura/sui/repositories'
import type { PropsLayout, PropsPosition } from '@khsura/sui/definitions'

export const usePositionService = (props: PropsPosition & PropsLayout) => {
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

import { computed } from 'vue'
import { type PropsColumn } from '@/app/definitions'
import { getCleanSetObject } from '@/app/lib'

export const useColumnService = (props: PropsColumn) => {
  const getIsSet = (value?: number | string | string | null) => {
    return value !== null && value !== undefined
  }

  const classListColumn = computed(() => {
    return getCleanSetObject({
      [`s_column__${props.cols}`]: getIsSet(props.cols),
      [`s_column--sm__${props.sm}`]: getIsSet(props.sm),
      [`s_column--md__${props.md}`]: getIsSet(props.md),
      [`s_column--lg__${props.lg}`]: getIsSet(props.lg),
      [`s_column--order__${props.order}`]: getIsSet(props.order),
      [`s_column--alignSelf__${props.alignSelf}`]: getIsSet(props.alignSelf),
    })
  })

  return {
    classListColumn,
  }
}

import { computed } from 'vue'
import { appPrefix } from '@/app/constants'
import { type PropsColumn } from '@/app/definitions'
import { getCleanSetObject } from '@/app/lib'

export const useColumnService = (props: PropsColumn, options?: { classPrefix?: string }) => {
  const prefix = options?.classPrefix ? `_${options.classPrefix}` : '_column'

  const getIsSet = (value?: number | string | string | null) => {
    return value !== null && value !== undefined
  }

  const classListColumn = computed(() => {
    return getCleanSetObject({
      [`${appPrefix}${prefix}__${props.cols}`]: getIsSet(props.cols),
      [`${appPrefix}${prefix}--sm__${props.sm}`]: getIsSet(props.sm),
      [`${appPrefix}${prefix}--md__${props.md}`]: getIsSet(props.md),
      [`${appPrefix}${prefix}--lg__${props.lg}`]: getIsSet(props.lg),
      [`${appPrefix}${prefix}--order__${props.order}`]: getIsSet(props.order),
      [`${appPrefix}${prefix}--alignSelf__${props.alignSelf}`]: getIsSet(props.alignSelf),
    })
  })

  return {
    classListColumn,
  }
}

import { appPrefix } from '@khsura/sui/constants'
import { type PropsColumn } from '@khsura/sui/definitions'
import { computed } from 'vue'

export const useColumnService = (props: PropsColumn, options?: { classPrefix?: string }) => {
  const prefix = options?.classPrefix ? `_${options.classPrefix}` : '_column'

  const classListColumn = computed(() => {
    return {
      [`${appPrefix}${prefix}__${props.cols}`]: props.cols ?? false,
      [`${appPrefix}${prefix}--sm__${props.sm}`]: props.sm ?? false,
      [`${appPrefix}${prefix}--md__${props.md}`]: props.md ?? false,
      [`${appPrefix}${prefix}--lg__${props.lg}`]: props.lg ?? false,
      [`${appPrefix}${prefix}--order__${props.order}`]: props.order ?? false,
      [`${appPrefix}${prefix}--alignSelf__${props.alignSelf}`]: props.alignSelf ?? false,
    }
  })

  return {
    classListColumn,
  }
}

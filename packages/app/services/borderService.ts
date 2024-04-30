import { type PropsBorder } from '@sui/app/definitions'
import { toComputed } from '@sui/app/lib/compositionApi'
import { computed } from 'vue'
import { type ComputedRef } from 'vue'
import { getCleanSetObject } from '../lib'

export const useBorderService = (
  props: Partial<PropsBorder> | ComputedRef<Partial<PropsBorder>>,
  options?: { block?: string },
) => {
  const computedProps = toComputed(props)
  const classPrefix = options?.block ? `s_${options.block}--` : 's_'

  const classListBorder = computed(() => {
    return getCleanSetObject({
      [`${classPrefix}outlined`]: computedProps.value.outlined,
      [`${classPrefix}tile`]: computedProps.value.tile,
      [`${classPrefix}rounded`]: computedProps.value.rounded,
      [`${classPrefix}underlined`]: computedProps.value.underlined,
    })
  })

  return {
    classListBorder,
  }
}

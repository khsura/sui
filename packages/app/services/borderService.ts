import { computed } from 'vue'
import { type ComputedRef } from 'vue'
import { getCleanSetObject } from '../lib'
import { type PropsBorder } from '@/app/definitions'
import { toComputed } from '@/app/lib/compositionApi'

export const useBorderService = (
  props?: Partial<PropsBorder> | ComputedRef<Partial<PropsBorder>>,
  options?: { block?: string },
) => {
  const computedProps = toComputed(props ?? {})
  const classPrefix = options?.block ? `s_${options.block}--` : 's_'
  const predefinedBorderRadiusTypes = ['tile', 'rounded'] as const

  const isPredefinedBorderRadiusType = computed(() => {
    return predefinedBorderRadiusTypes.includes(
      computedProps.value.borderRadius as (typeof predefinedBorderRadiusTypes)[number],
    )
  })

  const styleListBorder = computed(() => {
    return getCleanSetObject({
      borderRadius: !isPredefinedBorderRadiusType.value ? computedProps.value.borderRadius : undefined,
    })
  })

  const classListBorder = computed(() => {
    return getCleanSetObject({
      [`${classPrefix}outlined`]: computedProps.value.outlined,
      [`${classPrefix}tile`]: computedProps.value.borderRadius === 'tile',
      [`${classPrefix}rounded`]: computedProps.value.borderRadius === 'rounded',
      [`${classPrefix}underlined`]: computedProps.value.underlined,
    })
  })

  return {
    classListBorder,
    styleListBorder,
  }
}

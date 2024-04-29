import { type PropsBorder } from '@sui/app/definitions'
import { toComputed } from '@sui/app/lib/compositionApi'
import { computed } from 'vue'
import { type ComputedRef } from 'vue'

export const useBorderService = (
  props: Partial<PropsBorder> | ComputedRef<Partial<PropsBorder>>,
  options?: { block?: string },
) => {
  const computedProps = toComputed(props)
  const classPrefix = options?.block ? `s_${options.block}--` : 's_'

  const classListBorder = computed(() => {
    const classes = {
      [`${classPrefix}outlined`]: computedProps.value.outlined ?? undefined,
      [`${classPrefix}tile`]: computedProps.value.tile ?? undefined,
      [`${classPrefix}rounded`]: computedProps.value.rounded ?? undefined,
      [`${classPrefix}underlined`]: computedProps.value.underlined ?? undefined,
    }

    Object.entries(classes).forEach(([key, value]) => {
      if (value === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete classes[key]
      }
    })

    return classes
  })

  return {
    classListBorder,
  }
}

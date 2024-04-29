import { type PropsMeasurableStyles } from '@sui/app/definitions'
import { getNumericCssAttribute } from '@sui/app/lib'
import { computed } from 'vue'

export const useMeasurableStylesService = (props: PropsMeasurableStyles) => {
  const measurableStyles = computed(() => {
    return Object.fromEntries(
      Object.entries({
        height: getNumericCssAttribute(props.height ?? null)?.toString(),
        width: getNumericCssAttribute(props.width ?? null)?.toString(),
        maxHeight: getNumericCssAttribute(props.maxHeight ?? null)?.toString(),
        maxWidth: getNumericCssAttribute(props.maxWidth ?? null)?.toString(),
        minHeight: getNumericCssAttribute(props.minHeight ?? null)?.toString(),
        minWidth: getNumericCssAttribute(props.minWidth ?? null)?.toString(),
      }).filter(([_, value]) => value !== ''),
    ) as {
      height?: string
      width?: string
      maxHeight?: string
      maxWidth?: string
      minHeight?: string
      minWidth?: string
    }
  })

  return {
    measurableStyles,
  }
}

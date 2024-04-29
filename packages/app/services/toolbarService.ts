import { toolbarHeightSubractors } from '@sui/app/configs/toolbar'
import { ToolbarDensity } from '@sui/app/constants/toolbar'
import { type PropsToolbar } from '@sui/app/definitions'
import { getNumericValue } from '@sui/app/lib'
import { computed, useSlots } from 'vue'
import { toolbarExtensionHeightSubractors } from '../configs/toolbar'

export const useToolbarService = (props: PropsToolbar) => {
  const slots = useSlots()

  const isExtended = computed(() => {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    return !!(props.extended || slots.extension?.())
  })

  const contentHeight = computed(() => {
    const height = getNumericValue(props.height, false, 0)
    const contentHeight = height - toolbarHeightSubractors[props.density ?? ToolbarDensity.default]

    return getNumericValue(contentHeight, true, 0)
  })

  const extensionHeight = computed(() => {
    const height = getNumericValue(props.extensionHeight, false, 0)
    const extensionHeight = height - toolbarExtensionHeightSubractors[props.density ?? ToolbarDensity.default]

    return getNumericValue(extensionHeight, true, 0)
  })

  const toolbarHeight = computed(() => {
    return contentHeight.value + (isExtended.value ? extensionHeight.value : 0)
  })

  return {
    isExtended,
    contentHeight,
    extensionHeight,
    toolbarHeight,
  }
}

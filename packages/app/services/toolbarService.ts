import { getNumericValue } from '@sui/app/lib'
import { type PropsToolbar } from '@sui/app/definitions'
import { computed, useSlots } from 'vue'
import { toolbarHeightSubractors } from '@sui/app/configs/toolbar'
import { ToolbarDensity } from '@sui/app/constants/toolbar'
import { toolbarExtensionHeightSubractors } from '../configs/toolbar'

export const useToolbarService = (props: PropsToolbar) => {
  const slots = useSlots()

  const isExtended = computed(() => {
    return !!(props.extended ?? slots.extension?.())
  })

  const contentHeight = computed(() => {
    const height = getNumericValue(props.height, { defaultValue: 0, allowDecimal: true })
    const contentHeight = height - toolbarHeightSubractors[props.density ?? ToolbarDensity.default]

    return getNumericValue(contentHeight, { defaultValue: 0 })
  })

  const computedExtensionHeight = computed(() => {
    const height = getNumericValue(props.extensionHeight, { defaultValue: 0, allowDecimal: true })
    const extensionHeight = height - toolbarExtensionHeightSubractors[props.density ?? ToolbarDensity.default]

    return getNumericValue(extensionHeight, { defaultValue: 0 })
  })

  const toolbarHeight = computed(() => {
    return contentHeight.value + (isExtended.value ? computedExtensionHeight.value : 0)
  })

  return {
    isExtended,
    contentHeight,
    computedExtensionHeight,
    toolbarHeight,
  }
}

<template>
  <component :is="elementTag" class="s_main" :style="styles">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsMain } from '@/app/definitions'
import { getLengthWithSafeArea, getNumericCssAttribute } from '@/app/lib'
import { getIsFixedPosition } from '@/app/repositories/positionRepository'
import { useComponentDefaultsService, useLayoutService } from '@/app/services'

const rawProps = defineProps<PropsMain>()
const props = useComponentDefaultsService('SMain', rawProps)
const { app: layoutApp, isApp } = useLayoutService(props)

const elementTag = computed(() => {
  if (props.tag) {
    return props.tag
  }

  return isApp.value ? 'main' : 'section'
})

const styles = computed(() => {
  const widthToSubtract = layoutApp.value.left + layoutApp.value.right
  const isFixedPosition = getIsFixedPosition({ position: layoutApp.value.appBarPosition })
  const marginTop = isFixedPosition ? layoutApp.value.appBarHeight + layoutApp.value.offsetTop : 0
  const marginBottom = isApp.value ? layoutApp.value.bottomNavigationHeight : layoutApp.value.footerHeight
  // A fixed app bar pads itself by the notch inset, so the content starts that much lower too.
  const hasFixedAppBar = isFixedPosition && layoutApp.value.appBarHeight > 0

  const offsetTop = hasFixedAppBar
    ? getLengthWithSafeArea(getNumericCssAttribute(marginTop), 'top')
    : getNumericCssAttribute(marginTop)

  // An app bar that is not fixed sits in the flow above SMain, so it takes its height from the page too.
  const spaceAbove = isFixedPosition ? marginTop : layoutApp.value.appBarHeight
  const spaceTaken = getNumericCssAttribute(spaceAbove + marginBottom)
  const spaceTakenWithTopInset = hasFixedAppBar ? getLengthWithSafeArea(spaceTaken, 'top') : spaceTaken
  // the app's bottom navigation grows by the home-indicator inset as well
  const hasBottomNavigation = isApp.value && layoutApp.value.bottomNavigationHeight > 0

  const spaceTakenWithInsets = hasBottomNavigation
    ? getLengthWithSafeArea(spaceTakenWithTopInset, 'bottom')
    : spaceTakenWithTopInset

  return {
    marginTop: offsetTop,
    marginLeft: getNumericCssAttribute(layoutApp.value.left),
    marginRight: getNumericCssAttribute(layoutApp.value.right),
    width: `calc(100% - ${getNumericCssAttribute(widthToSubtract)})`,
    minHeight: `calc(${isApp.value ? '100vh' : '100%'} - ${spaceTakenWithInsets})`,
  }
})
</script>

<style lang="scss">
.s_main {
  position: relative;
}
</style>

<template>
  <component :is="elementTag" class="s_main" :style="styles">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsLayout, propsTag } from '@sui/app/props'
import { getIsFixedOrAbsolutePosition } from '@sui/app/repositories/positionRepository'
import { useLayoutService } from '@sui/app/services'
import { computed } from 'vue'

const props = defineProps({
  ...propsLayout(),
  ...propsTag({
    tag: null,
  }),
})

const { app, isApp } = useLayoutService(props)

const elementTag = computed(() => {
  if (props.tag) {
    return props.tag
  }

  return isApp.value ? 'main' : 'section'
})

const styles = computed(() => {
  const widthToSubtract = app.value.left + app.value.right
  const isFixedOrAbsoluteAppBar = getIsFixedOrAbsolutePosition({ position: app.value.appBarPosition, app: isApp.value })
  const marginTop = isFixedOrAbsoluteAppBar ? app.value.appBarHeight + app.value.offsetTop : 0
  const marginBottom = isApp.value ? app.value.bottomNavigationHeight : app.value.footerHeight

  return {
    marginTop: getNumericCssAttribute(marginTop),
    marginLeft: getNumericCssAttribute(app.value.left),
    marginRight: getNumericCssAttribute(app.value.right),
    width: `calc(100% - ${getNumericCssAttribute(widthToSubtract)})`,
    minHeight: `calc(${isApp.value ? '100vh' : '100%'} - ${getNumericCssAttribute(marginTop + marginBottom)})`,
  }
})
</script>

<style lang="scss">
.s_main {
  position: relative;
}
</style>

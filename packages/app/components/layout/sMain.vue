<template>
  <component :is="elementTag" class="s_main" :style="styles">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsMain } from '@khsura/sui/definitions'
import { getNumericCssAttribute } from '@khsura/sui/lib'
import { getIsFixedPosition } from '@khsura/sui/repositories/positionRepository'
import { useLayoutService } from '@khsura/sui/services'

const props = defineProps<PropsMain>()
const { app, isApp } = useLayoutService(props)

const elementTag = computed(() => {
  if (props.tag) {
    return props.tag
  }

  return isApp.value ? 'main' : 'section'
})

const styles = computed(() => {
  const widthToSubtract = app.value.left + app.value.right
  const isFixedPosition = getIsFixedPosition({ position: app.value.appBarPosition })
  const marginTop = isFixedPosition ? app.value.appBarHeight + app.value.offsetTop : 0
  const marginBottom = isApp.value ? app.value.bottomNavigationHeight : app.value.footerHeight
  const offsetTop = getNumericCssAttribute(marginTop)

  return {
    marginTop: offsetTop,
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

<template>
  <component :is="elementTag" class="s_main" :style="styles">
    <slot></slot>
  </component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { type PropsMain } from '@/app/definitions'
import { getNumericCssAttribute } from '@/app/lib'
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
  const offsetTop = getNumericCssAttribute(marginTop)

  return {
    marginTop: offsetTop,
    marginLeft: getNumericCssAttribute(layoutApp.value.left),
    marginRight: getNumericCssAttribute(layoutApp.value.right),
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

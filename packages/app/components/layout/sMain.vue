<template>
  <Component :is="elementTag" class="s_main" :style="styles">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { getNumericCssAttribute } from '@sui/app/lib'
import { propsLayout, propsTag } from '@sui/app/props'
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

  return {
    marginTop: getNumericCssAttribute(isApp.value ? app.value.bar : 0),
    marginLeft: getNumericCssAttribute(app.value.left),
    marginRight: getNumericCssAttribute(app.value.right),
    width: `calc(100% - ${getNumericCssAttribute(widthToSubtract)})`,
    minHeight: `calc(${isApp.value ? '100dvh' : '100%'} - ${getNumericCssAttribute(
      app.value.bar + app.value.footer + app.value.bottom,
    )})`,
  }
})
</script>

<style lang="scss">
.s_main {
  position: relative;
}
</style>

<template>
  <div class="s_layout" :style="measurableStyles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { propsLayoutProvider, propsMeasurableStyles } from '@sui/app/props'
import { useLayoutProviderService, useMeasurableStylesService } from '@sui/app/services'

const props = defineProps({
  ...propsLayoutProvider(),
  ...propsMeasurableStyles(),
})

const { measurableStyles } = useMeasurableStylesService(props)

useLayoutProviderService(props)
</script>
<style lang="scss">
.s_layout {
  position: relative;
  display: flex;
  flex-flow: column;
  flex-wrap: 1 1 auto;
}
</style>

<template>
  <div class="s_layout" :style="measurableStyles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { inject } from 'vue'
import { ProviderName } from '@/app/configs'
import { type PropsLayoutContainer } from '@/app/definitions'
import { useLayoutProviderService, useMeasurableStylesService } from '@/app/services'

const props = defineProps<PropsLayoutContainer>()
const { measurableStyles } = useMeasurableStylesService(props)
const appState = inject(ProviderName.app)

if (!appState) {
  throw new Error('AppState not found')
}

useLayoutProviderService(props, appState)
</script>
<style lang="scss">
.s_layout {
  position: relative;
  display: flex;
  flex-flow: column;
  flex-wrap: 1 1 auto;
}
</style>

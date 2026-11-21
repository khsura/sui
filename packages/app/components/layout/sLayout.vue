<template>
  <div class="s_layout" :style="measurableStyles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { type PropsLayoutContainer } from '@/app/definitions'
import { useComponentDefaultsService, useLayoutProviderService, useMeasurableStylesService } from '@/app/services'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'

const rawProps = defineProps<PropsLayoutContainer>()
const props = useComponentDefaultsService('SLayout', rawProps)
const { measurableStyles } = useMeasurableStylesService(props)
const { appState } = useAppProviderRepository(props.name)

useLayoutProviderService(props, appState)
</script>
<style lang="scss">
.s_layout {
  position: relative;
  display: flex;

  // a layout directly in SApp grows to the viewport height with it
  flex: 1 0 auto;
  flex-flow: column;
}
</style>

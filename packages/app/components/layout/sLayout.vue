<template>
  <div class="s_layout" :style="measurableStyles">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { type PropsLayoutContainer } from '@/app/definitions'
import { useLayoutProviderService, useMeasurableStylesService } from '@/app/services'
import { useAppProviderRepository } from '@/app/repositories/core/appProviderRepository'

const props = defineProps<PropsLayoutContainer>()
const { measurableStyles } = useMeasurableStylesService(props)
const { appState } = useAppProviderRepository(props.name)

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

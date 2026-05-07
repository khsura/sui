<template>
  <Component :is="tagName" :class="classList" :style="styleList">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropsSheet } from '@/app/definitions'
import {
  useBorderService,
  useColorService,
  useComponentDefaultsService,
  useElevationService,
  useMeasurableStylesService,
  useTagService,
} from '@/app/services'

const rawProps = defineProps<PropsSheet>()
const props = useComponentDefaultsService('SSheet', rawProps)
const { classListColor, styleListColor } = useColorService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListBorder, styleListBorder } = useBorderService(props)
const { classListElevation } = useElevationService(props)
const { tagName } = useTagService(props)

const classList = computed(() => {
  return {
    s_sheet: true,
    ...classListColor.value,
    ...classListBorder.value,
    ...classListElevation.value,
  }
})

const styleList = computed(() => {
  return {
    ...styleListColor.value,
    ...styleListBorder.value,
    ...measurableStyles.value,
  }
})
</script>
<style lang="scss">
.s_sheet {
  background-color: s_getAppColor('card');
}
</style>

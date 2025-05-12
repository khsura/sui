<template>
  <Component :is="tagName" :class="classList" :style="styleList">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { PropsSheet } from '@khsura/sui/definitions'
import {
  useBorderService,
  useColorService,
  useElevationService,
  useMeasurableStylesService,
  useTagService,
} from '@khsura/sui/services'

const props = defineProps<PropsSheet>()
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

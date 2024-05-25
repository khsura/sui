<template>
  <Component :is="tagName" :class="classList" :style="styleList">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { propsBorder, propsColor, propsElevation, propsMeasurableStyles, propsTag } from '@khsura/sui/props'
import {
  useBorderService,
  useColorService,
  useElevationService,
  useMeasurableStylesService,
  useTagService,
} from '@khsura/sui/services'
import { computed } from 'vue'

const props = defineProps({
  ...propsTag(),
  ...propsColor(),
  ...propsMeasurableStyles(),
  ...propsBorder(),
  ...propsElevation(),
})

const { classListColor, styleListColor } = useColorService(props)
const { measurableStyles } = useMeasurableStylesService(props)
const { classListBorder } = useBorderService(props)
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
    ...measurableStyles.value,
  }
})
</script>
<style lang="scss">
.s_sheet {
  background-color: s_getAppColor('card');
}
</style>

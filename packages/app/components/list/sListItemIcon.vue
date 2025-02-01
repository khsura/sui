<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { propsListMediaItem } from '@khsura/sui/props'
import { useListMediaItemService } from '@khsura/sui/services'

const props = defineProps(propsListMediaItem())
const { classes } = useListMediaItemService(props, { componentName: 'listItemIcon' })
</script>
<style lang="scss">
$s_listItemIcon--margin: calc(4 * $s_spacer) !default;

.s_listItemIcon {
  margin-right: $s_listItemIcon--margin;
  margin-left: $s_listItemIcon--margin;

  @include s_createListItemMediaContent();
}
</style>

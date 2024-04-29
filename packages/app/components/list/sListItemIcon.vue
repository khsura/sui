<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script lang="ts" setup>
import { propsListMediaItem } from '@sui/app/props'
import { useListMediaItemService } from '@sui/app/services'

const props = defineProps(propsListMediaItem())
const { classes } = useListMediaItemService(props, { componentName: 'listItemIcon' })
</script>
<style lang="scss">
@import './helper';
$s_listItemIcon--margin: calc(4 * $s_spacer) !default;

.s_listItemIcon {
  @include s_createListItemMediaContent();
  margin-right: $s_listItemIcon--margin;
  margin-left: $s_listItemIcon--margin;
}
</style>

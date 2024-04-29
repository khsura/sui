<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { propsListMediaItem } from '@sui/app/props'
import { useListMediaItemService } from '@sui/app/services'

const props = defineProps(propsListMediaItem())
const { classes } = useListMediaItemService(props, { componentName: 'listItemAction' })
</script>
<style lang="scss">
@import './helper';

.s_listItemAction {
  @include s_createListItemMediaContent();
  margin-left: calc($s_spacer * 8);

  &:first-of-type {
    margin-right: calc($s_spacer * 8);
  }
}
</style>

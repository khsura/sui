<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { propsListMediaItem } from '~/props'
import { useListMediaItemService } from '~/services'

const props = defineProps(propsListMediaItem())
const { classes } = useListMediaItemService(props, { componentName: 'listItemAction' })
</script>
<style lang="scss">
.s_listItemAction {
  margin-left: calc($s_spacer * 8);

  @include s_createListItemMediaContent();

  &:first-of-type {
    margin-right: calc($s_spacer * 8);
  }
}
</style>

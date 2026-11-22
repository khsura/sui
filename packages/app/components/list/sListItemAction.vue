<template>
  <div :class="classes">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import type { PropsListMediaItem } from '@/app/definitions'
import { useListMediaItemService } from '@/app/services'

const props = defineProps<PropsListMediaItem>()
const { classes } = useListMediaItemService(props, { componentName: 'listItemAction' })
</script>
<style lang="scss">
.s_listItemAction {
  margin: 0 calc($s_spacer * 4) 0 calc($s_spacer * 8);

  @include s_createListItemMediaContent();

  &:first-of-type {
    margin-right: calc($s_spacer * 8);
  }
}

// Actions after the text keep their gap as padding, and an auto margin pushes them to the right edge when the
// list item wraps them onto their own line (see SListItemContent's minimum width).
.s_listItemContent ~ .s_listItemAction {
  padding-left: calc($s_spacer * 8);
  margin-left: auto;

  &.s_listItemAction--dense {
    padding-left: calc($s_spacer * 2);
  }
}
</style>

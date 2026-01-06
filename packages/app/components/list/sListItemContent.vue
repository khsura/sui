<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { ProviderPropsName } from '@/app/configs'

const listItemProps = inject(ProviderPropsName.listItemProps, null)

if (!listItemProps) {
  throw new Error('listItemProps not found')
}

const classList = computed(() => {
  return {
    s_listItemContent: true,
    [`s_listItemContent--lineClamp__${listItemProps.lines}`]: !!listItemProps.lines,
  }
})
</script>

<style lang="scss">
$s_listItemContentChildrenMarginBottom: calc($s_spacer / 2) !default;

.s_listItemContent {
  display: flex;
  flex: 1 1;
  flex-wrap: wrap;
  align-items: center;
  align-self: stretch;
  padding: $s_listItem__content--padding 0;
  overflow: hidden;

  > * {
    flex: 1 0 100%;
    line-height: 1.1;

    &:not(:last-child) {
      margin-bottom: $s_listItemContentChildrenMarginBottom;
    }
  }
}
</style>

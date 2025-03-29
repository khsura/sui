<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '~/constants'
import { useProviderService } from '~/services'

const { injectParentProps } = useProviderService()
const listItemProps = injectParentProps(ProviderPropsName.listItemProps)

const classList = computed(() => {
  return {
    s_listItemContent: true,
    [`s_listItemContent--lineClamp__${listItemProps.value.lines}`]: !!listItemProps.value.lines,
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

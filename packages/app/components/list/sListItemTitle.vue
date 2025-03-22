<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { ProviderPropsName } from '@khsura/sui/constants'
import { useProviderService } from '@khsura/sui/services'

const { injectParentProps } = useProviderService()
const listProps = injectParentProps(ProviderPropsName.listProps)

const classList = computed(() => {
  return {
    s_listItemTitle: true,
    's_listItemTitle--dense': !!listProps.value.dense,
  }
})
</script>
<style lang="scss">
.s_listItemTitle {
  @include s_typography('body__1');
  @include s_textTruncate();
  font-weight: 500;

  &--dense {
    @include s_typography('body__2');
    font-weight: 500;
  }
}
</style>

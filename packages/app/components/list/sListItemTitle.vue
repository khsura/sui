<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { ProviderPropsName } from '@/app/configs'

const listProps = inject(ProviderPropsName.listProps, null)

if (!listProps) {
  throw new Error('List props not found')
}

const classList = computed(() => {
  return {
    s_listItemTitle: true,
    's_listItemTitle--dense': !!listProps.dense,
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

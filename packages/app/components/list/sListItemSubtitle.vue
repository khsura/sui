<template>
  <div :class="classList">
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import { computed, inject } from 'vue'
import { ProviderPropsName } from '@/app/configs'

const listProps = inject(ProviderPropsName.listProps, null)
const listItemProps = inject(ProviderPropsName.listItemProps, null)

if (!listItemProps || !listProps) {
  throw new Error('List or ListItem props not found')
}

const classList = computed(() => {
  const lines = listItemProps.lines ?? listProps.lines

  return {
    s_listItemSubtitle: true,
    [`s_listItemSubtitle--lineClamp__${lines}`]: !!lines,
  }
})
</script>

<style lang="scss">
.s_listItemSubtitle {
  @include s_typography('body__2');
  @include s_lineClamp(2);

  @for $i from 1 through 6 {
    &--lineClamp__#{$i} {
      @include s_lineClamp($i);
    }
  }
}
</style>

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
const listProps = injectParentProps(ProviderPropsName.listProps)
const listItemProps = injectParentProps(ProviderPropsName.listItemProps)

const classList = computed(() => {
  const lines = listItemProps.value.lines ?? listProps.value.lines

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

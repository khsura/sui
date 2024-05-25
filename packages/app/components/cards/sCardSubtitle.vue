<template>
  <Component :is="tagName" class="s_card__subtitle">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { propsTag } from '@khsura/sui/props'
import { useTagService } from '@khsura/sui/services'

const props = defineProps({
  ...propsTag(),
})

const { tagName } = useTagService(props)
</script>
<style lang="scss">
@import '@khsura/sui/styles/components/cards';

.s_card__subtitle {
  @include s_typography('subtitle__2');
  padding: $s_cardItemPadding;
  font-weight: 400;
}
</style>

<template>
  <Component :is="tagName" class="s_card__text">
    <slot></slot>
  </Component>
</template>
<script setup lang="ts">
import { propsTag } from '@sui/app/props'
import { useTagService } from '@sui/app/services'

const props = defineProps({
  ...propsTag(),
})

const { tagName } = useTagService(props)
</script>
<style lang="scss">
@import '@sui/app/styles/components/cards';

.s_card__text {
  @include s_typography('subtitle__2');
  width: 100%;
  padding: $s_cardItemPadding;
  font-weight: 400;
}
</style>
